import { Worker, Queue } from 'bullmq';
import { addQueue } from './bull-board.js';
import { connection } from './redis-connection.js';
import { sendMessage } from './send-message.js';
import { updateScheduledJob, incrementCount } from '../../../db/dal/scheduledDistributionTask.js';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import * as DepartmentService from '../../../db/service/DeparmentService.js';
import * as blacklistController from '../blacklist/index.js';
import logger from '../../../utils/logger/index.js';

const limiter = {
  max: 120,
  duration: 60 * 1000,
};

const sendMessageAndHandleResult = async (job, MessageQueue) => {
  const result = await sendMessage(job.data);
  if (result?.error) {
    logger.error(`Error in MessageQueue: ${MessageQueue}`);
    await job.log(result?.message);
    await job.moveToFailed(new Error(result?.message), MessageQueue.token, true);
    return;
  }
  return `Job (${job.id}) returned with result: ${result?.message}`;
};

const isPhoneBlacklisted = async (job) => {
  const blacklist = (await blacklistController.getAll(job.data.generalData.departmentId, undefined, true)).map((x) => x.phone);
  return blacklist.includes(job.data.clientData.phone);
};

const handleCompletedJob = (job) => {
  const { protocolType, departmentId } = job.data.generalData;
  DepartmentService.updateCountMessage({ departmentId, count: 1, protocolType }, 'decrementing');
  incrementCount('successCount', 1, job.queue.name)
};

const handleDrainedQueue = async (worker, queue) => {
    await updateScheduledJob(queue.name, 0);
    await worker.close();
    logger.info(`All messages sent in queue: ${queue.name}`);
};

const handleFailedQueue = async (job, err) => {
  logger.error(`Failed job ${job.id} with error: ${err}`);
  if (job.attemptsMade >= job.opts.attempts) {
    logger.error(`Job ${job.id} has exhausted all retry attempts.`);
    incrementCount('failedCount', 1, job.queue.name)
  }
};

export const runWorker = async (MessageQueue, newQueue) => {
  const queue = new Queue(MessageQueue, { connection });
  const jobCount = await queue.getJobCounts();

  if (newQueue) {
    const queueAdapter = new BullMQAdapter(queue);
    addQueue(queueAdapter);
    logger.info(`Queue added: ${MessageQueue}`);
  }

  if (jobCount.active || jobCount.delayed || jobCount.waiting) {
    logger.info(`Starting worker for queue: ${MessageQueue}`);

    const worker = new Worker(
      MessageQueue,
      async (job) => {
        if (await isPhoneBlacklisted(job)) {
          return { jobId: `(${job.id}) : Message not sent - client in blacklist` };
        }
        return sendMessageAndHandleResult(job, MessageQueue);
      },
      { connection, limiter }
    );

    worker.on('completed', handleCompletedJob);
    worker.on('failed', handleFailedQueue);
    worker.on('error', (err) => logger.error(`Worker error: ${err}`));
    worker.on('drained', () => handleDrainedQueue(worker, queue));
    worker.on('closed', () => logger.warn('Worker closed'));
  }
};

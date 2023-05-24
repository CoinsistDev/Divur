import { Worker, Queue } from 'bullmq';
import { connection } from './redis-connection.js';
import { sendMessage } from './send-message.js';
import { updateScheduledJob } from '../../../db/dal/scheduledDistributionTask.js';
import * as DepartmentService from '../../../db/service/DeparmentService.js';

const option = {
  connection,
  limiter: {
    max: 120,
    duration: 60 * 1000,
  },
};

export const runWorker = async (MessageQueue) => {
  const queue = new Queue(MessageQueue, { connection });
  let jobCount = await queue.getJobCounts();
  if (jobCount.active || jobCount.delayed || jobCount.waiting) {
    const worker = new Worker(
      MessageQueue,
      async (job) => {
        // await job.updateProgress('TEST 1');
        const result = await sendMessage(job.data);
        if (result?.error) {
          console.log('MessageQueue: ' + MessageQueue);
          await job.log(result?.message);
          return await job.moveToFailed(new Error(result?.message), MessageQueue.token, true);
        }
        return { jobId: `This is the return value of job (${job.id}) with result: ${result?.message}` };
      },
      option
    );

    worker.on('completed', (job) => {
      // console.log(`Completed job ${job.id} successfully, sent ${job.data.generalData.protocolType} to ${job.data.clientData.phone}`)
      if (job.data.generalData.protocolType === 'SMS') {
        DepartmentService.updateCountMessage({ departmentId: job.data.generalData.departmentId, count: 1, protocolType: 'SMS' }, 'decrementing');
      } else {
        DepartmentService.updateCountMessage({ departmentId: job.data.generalData.departmentId, count: 1, protocolType: 'WhatsApp' }, 'decrementing');
      }
    });
    worker.on('failed', (job, err) => console.log(`Failed job ${job.id} with ${err}`));
    worker.on('error', (err) => {
      console.error(err);
    });
    worker.on('drained', async () => {
      console.log('drained: ' + queue.name);
      jobCount = await queue.getJobCounts();
      if (!jobCount.active && !jobCount.delayed && !jobCount.failed && !jobCount.waiting) {
        await updateScheduledJob(MessageQueue, 0);
        await worker.close();
        await queue.clean();
        console.log('All Message sent');
      }
    });

    worker.on('closed', () => {
      console.error('worker closed');
    });
  }
};

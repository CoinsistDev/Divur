import logger from '../../../utils/logger/index.js'
import { FlowProducer } from 'bullmq';
import { runWorker } from './reciver.js';
import { createScheduledJob } from '../../../db/dal/scheduledDistributionTask.js';
import { getCannedRepliesTitleEvent } from '../../../db/service/MessageLogService.js';

const flowProducer = new FlowProducer();

export const addJobsToQueue = async (clientData, generalData) => {
  const option = {
    attempts: 4,
    maxStalledCount: 0,
    backoff: {
      type: 'exponential',
      delay: 40000,
    },
  };

  try {
    const distributionTitle = await getCannedRepliesTitleEvent(generalData.departmentId, generalData.Message);
    const clientLength = clientData.length;
    let scheduleDate = new Date();
    let delay = 0;
    if (generalData.ScheduleDate) {
      logger.info('Scheduling date set. Creating Scheduled job.');
      scheduleDate = new Date(generalData.ScheduleDate);
      delay = scheduleDate.getTime() - Date.now();
      option.delay = delay;
    } else {
      logger.info('No scheduling date set. Creating Scheduled job with current date.');
    }
    
    const scheduleJobDB = await createScheduledJob(scheduleDate, generalData.departmentId, generalData.userMail, distributionTitle, clientLength);
    

    const children = clientData.map((clientData) => ({
      name: generalData.departmentName,
      data: { clientData, generalData },
      queueName: scheduleJobDB.id.toString(),
      opts: option,
    }));

    await flowProducer.add({
      name: `${generalData.departmentName} flow`,
      queueName: generalData.departmentName,
      children,
    });

    runWorker(scheduleJobDB.id.toString(), true);

    return {
      taskId: scheduleJobDB.id.toString(),
      id: scheduleJobDB.id.toString(),
      scheduledFor: generalData.ScheduleDate,
      createdAt: new Date(),
    };
  } catch (error) {
    logger.error('Error adding jobs to queue:', error);
  }
};

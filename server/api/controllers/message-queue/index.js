import logger from '../../../utils/logger/index.js'
import moment from 'moment';
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
      delay: 25000,
    },
  };

  try {
    const distributionTitle = await getCannedRepliesTitleEvent(generalData.departmentId, generalData.Message);

    let scheduleJobDB;
    if (generalData.ScheduleDate) {
      logger.info('Scheduling date set. Creating Scheduled job.');
      const timeToSendMoment = moment(generalData.ScheduleDate);
      const nowMoment = moment(new Date());
      const diff = timeToSendMoment.diff(nowMoment);
      option.delay = diff;
      scheduleJobDB = await createScheduledJob(generalData.ScheduleDate, generalData.departmentId, generalData.userMail, distributionTitle);
    } else {
      logger.info('No scheduling date set. Creating Scheduled job with current date.');
      scheduleJobDB = await createScheduledJob(new Date(), generalData.departmentId, generalData.userMail, distributionTitle);
    }

    const children = clientData.map((client) => ({
      name: generalData.departmentName,
      data: { client, generalData },
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

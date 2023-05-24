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
    let scheduleJobDB;
    const distributionTitle = await getCannedRepliesTitleEvent(generalData.departmentId, generalData.Message);
    if (generalData.ScheduleDate) {
      console.log('generalData.ScheduleDate');
      scheduleJobDB = await createScheduledJob(generalData.ScheduleDate, generalData.departmentId, generalData.userMail, distributionTitle);
      const timeToSendMoment = moment(generalData.ScheduleDate);
      const nowMoment = moment(new Date());
      const diff = timeToSendMoment.diff(nowMoment);
      option.delay = diff;
    } else {
      scheduleJobDB = await createScheduledJob(new Date(), generalData.departmentId, generalData.userMail, distributionTitle);
    }
    const children = clientData.map((clientData) => {
      return {
        name: generalData.departmentName,
        data: { clientData, generalData },
        queueName: scheduleJobDB.id.toString(),
        opts: option,
      };
    });
    const flow = await flowProducer.add({
      name: generalData.departmentName + ' flow',
      queueName: generalData.departmentName, // parent queue name
      children,
    });
    runWorker(scheduleJobDB.id.toString());
    return {
      taskId: scheduleJobDB.id.toString(),
      id: scheduleJobDB.id.toString(),
      scheduledFor: generalData.ScheduleDate,
      createdAt: new Date(),
    };
  } catch (error) {
    logger.error(error)
    console.log('addJobsToQueue ERR');
    console.log(error);
  }
};

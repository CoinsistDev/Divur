import { ScheduledDistributionTask } from '../models/index.js';
import logger from '../../utils/logger/index.js';

export const createScheduledJob = async (scheduledFor, departmentId, distributor, distributionTitle, totalCount) => {
  logger.info(`Creating Scheduled Job for department ${departmentId}`);
  const task = await ScheduledDistributionTask.create({
    scheduledFor,
    status: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    departmentId,
    distributor,
    distributionTitle,
    totalCount,
  });
  logger.info(`Scheduled Job ${task.id} created for department ${departmentId}`);
  return task;
};

export const updateScheduledJob = async (id, status) => {
  try {
    logger.info(`Updating Scheduled Job with ID ${id}`);
    const scheduledJob = await ScheduledDistributionTask.findByPk(id);
    if (!scheduledJob) {
      logger.error(`Scheduled Job with ID ${id} not found`);
      throw new Error('Scheduled Job not found');
    }
    const updatedJob = await scheduledJob.update({ status: status });
    logger.info(`Scheduled Job with ID ${id} updated successfully`);
    return updatedJob;
  } catch (error) {
    logger.error(`Error in updating Scheduled Job with ID ${id} - ${error}`);
  }
};

export const incrementCount = (field, count, id) => {
  ScheduledDistributionTask.increment({ [field]: count }, { where: { id } });
};

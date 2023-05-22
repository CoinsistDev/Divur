import { ScheduledDistributionTask, Department } from '../models/index.js'



export const createScheduledJob = async (scheduledFor, departmentId, distributor, distributionTitle) => {
    const mesLog = await ScheduledDistributionTask.create({
        scheduledFor,
        status: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId,
        distributor,
        distributionTitle
    })
    return mesLog
}

export const updateScheduledJob = async (id, status) => {
    try {
        const scheduledJob = await ScheduledDistributionTask.findByPk(id)
        if (!scheduledJob) {
            throw new Error('scheduledJob not found')
        }
        return await scheduledJob.update({status: status})
    } catch (error) {
        console.log(error);
    }
}


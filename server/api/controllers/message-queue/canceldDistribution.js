import {  Worker, Queue } from "bullmq";
import { connection } from './redis-connection.js';
import { updateScheduledJob } from '../../../db/dal/scheduledDistributionTask.js'




export const canceldDistribution = async (MessageQueue) => {
        const queue = new Queue(MessageQueue, {connection});
       await queue.obliterate();
       await updateScheduledJob(MessageQueue, 3)
}

    

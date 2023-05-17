import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { ExpressAdapter } from '@bull-board/express'
import { Queue } from 'bullmq';
import { connection } from './redis-connection.js'
import { fetchQueueTitles } from './queueTitles.js'
import { runWorker } from './reciver.js';


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const queueTitles = await fetchQueueTitles()


queueTitles.forEach(element => runWorker(element.queueName.toString()) );


const queueAdapter = queueTitles.map(q => new BullMQAdapter(new Queue(q.queueName, { connection })))

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: queueAdapter,
    serverAdapter,
});


export { serverAdapter, addQueue, removeQueue, setQueues, replaceQueues }
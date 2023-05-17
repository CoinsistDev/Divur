import IORedis from 'ioredis';
import EventEmitter from "events";  

EventEmitter.defaultMaxListeners = 30;



const connection = new IORedis({ maxRetriesPerRequest: null, });

export {connection}
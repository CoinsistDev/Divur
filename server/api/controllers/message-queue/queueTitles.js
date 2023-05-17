import { connection  } from './redis-connection.js'

export async function fetchQueueTitles(prefix) { 
    const keys = await connection.keys('*')
    const QueueArray = keys.map( key => {
        const parts = key.split(':');
        if (parts[parts.length - 1] === 'meta')
            return {
                prefix: parts.slice(0, -2).join(':'),
                queueName: parts[parts.length - 2],
                set: 'meta'
            };
    }).filter(notUndefined => notUndefined !== undefined && !isUUID(notUndefined.queueName));
    return [...new Set(QueueArray)];
}

function isUUID ( uuid ) {
    let s = "" + uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
}
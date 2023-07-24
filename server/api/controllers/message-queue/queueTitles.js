import { connection  } from './redis-connection.js';

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const isUUID = uuid => UUID_REGEX.test(uuid);

export const fetchQueueTitles = async (prefix) => { 
    const keys = await connection.keys('*');
    return keys.map(key => {
        const parts = key.split(':');
        if (parts[parts.length - 1] === 'meta') {
            return {
                prefix: parts.slice(0, -2).join(':'),
                queueName: parts[parts.length - 2],
                set: 'meta'
            };
        }
    }).filter(item => item && !isUUID(item.queueName));
};
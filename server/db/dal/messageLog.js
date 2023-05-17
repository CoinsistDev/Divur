import moment from 'moment'
import { Op } from 'sequelize'
import { MessageLog, Department } from '../models/index.js'
import logger from '../../utils/logger/index.js'

const expiryDate = 2;


export const create = async (payload) => {
    const mesLog = await MessageLog.create(payload)
    return mesLog
}

export const createBulk = async (payload) => {
    try {
        const mesLog = await MessageLog.bulkCreate(payload)
        console.log('createBulk success');
        console.log(payload);
        return true
    } catch (error) {
        logger.error(error)
        console.log(error);
        return false
    }
}

export const getLog = async (departmentId, startDate, endDate) => {
    const query = MessageLog.findAll({ where: { "Date": { [Op.between]: [startDate, endDate] }, departmentId } })
    if (!query) {
        throw new Error('not found')
    }
    return query
}

export const getLogNoTime = async (departmentId) => {
    const query = await MessageLog.findAll({ where: { departmentId: departmentId } });
    return query || []
}

export const deleteMessage = async (departmentId, messageId) => {
const destroy = await MessageLog.destroy({where: {id: messageId, departmentId }});
    return !!destroy
}


export const deleteOldMessages = async () => {
    try {
        MessageLog.destroy({
            where: {
                "Date": {[Op.lte]: new Date(Date.now() - (60*60*24*90*1000))}
            }
        });
    } catch (error) {
        console.log(error);
    }
    }

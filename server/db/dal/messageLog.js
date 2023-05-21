import { Op, literal } from 'sequelize'
import { MessageLog } from '../models/index.js'
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
        return true
    } catch (error) {
        logger.error(error)
        console.log(error);
        return false
    }
}


export const getLog = async (departmentId, startDate, endDate) => {
    const query = await MessageLog.findAndCountAll({
      where: {
        "Date": {
          [Op.between]: [startDate, endDate]
        },
        departmentId
      },
      attributes: [
        [literal(`COUNT(CASE WHEN "message_log"."isBlackList" = false AND "message_log"."Status" != 'Read' AND "message_log"."Status" != 'Accepted' THEN 1 END)`), 'totalNonTicketSent'],
        [literal(`COUNT(CASE WHEN "message_log"."isBlackList" = false AND "message_log"."Status" = 'Delivered' THEN 1 END)`), 'totalNonTicketMessageDelivered'],
        [literal(`COUNT(CASE WHEN "message_log"."isBlackList" = false AND "message_log"."Status" = 'Read' THEN 1 END)`), 'totalNonTicketMessageRead'],
        [literal(`COUNT(CASE WHEN "message_log"."isBlackList" = false AND "message_log"."Status" = 'Rejected' THEN 1 END)`), 'totalNonTicketMessageFailed'],
        [literal(`COUNT(CASE WHEN "message_log"."isBlackList" = true THEN 1 END)`), 'totalBlackListMessage']
      ]
    });

    if (!query) {
      throw new Error('not found');
    }
  
    const { count, rows } = query;

    const messageLogStats = {
        totalNonTicketMessageDelivered: rows[0].dataValues.totalNonTicketMessageDelivered || 0,
        totalNonTicketSent: rows[0].dataValues.totalNonTicketSent || 0,
        totalNonTicketMessageRead: rows[0].dataValues.totalNonTicketMessageRead || 0,
        totalNonTicketMessageFailed: rows[0].dataValues.totalNonTicketMessageFailed || 0,
        totalBlackListMessage: rows[0].dataValues.totalBlackListMessage || 0,
        totalCount: count
      };
    
      return messageLogStats;
  };

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

export const updateCannedReplies  = async (cannedReplies) => {
    try {
        await MessageLog.bulkCreate(cannedReplies, {
          updateOnDuplicate: ["cannedRepliesTitle"]});
    } catch (error) {
        console.log(error);
    }
}

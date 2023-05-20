import Cron from 'node-cron'
import levenshtein from 'fastest-levenshtein'
import { getAllDepartmentsId } from '../dal/Deparment.js'
import Redis from 'ioredis';
import { getEvents, deleteEvents} from '../../api/controllers/glassix/index.js'
import * as MessageLogDal from '../dal/messageLog.js'
import * as DepartmentService from './DeparmentService.js'
import logger from '../../utils/logger/index.js'

const redis = new Redis({ maxRetriesPerRequest: null, });


export const addMessageLog = async (webhook) => {
    const message = webhook.changes[0].message
    const data = {
        Date: webhook.dateTime,
        From: message.from,
        To: message.to,
        Text: message.text,
        Status: message.status,
        departmentId: message.departmentId,
        ProtocolType: message.protocolType,
        isBlackList: false,
        ProviderMessageId: message.providerMessageId
    }
    return await MessageLogDal.create(data)
}

export const addToMessageBlacklist = async (blacklistUsers, generalData) => {
  const blackListRecord = blacklistUsers.map(bl => ({
      Date: generalData?.ScheduleDate || new Date(),
      From: generalData.From,
      To: bl.phone,
      Text: generalData.Message,
      Status: 'Undelivered(BlackList)',
      departmentId: generalData.departmentId,
      ProtocolType: generalData.protocolType,
      isBlackList: true,
  }))
  return await MessageLogDal.createBulk(blackListRecord)
}


export const getLogData = async (departmentId, startDate, endDate) => {
    const messages = await MessageLogDal.getLog(departmentId, startDate, endDate)
    return sortLogData(messages)
}

export const getLogDataToExcell = async (departmentId, startDate, endDate) => {
    const messages = await MessageLogDal.getLog(departmentId, startDate, endDate)  
    return sortLogDataForExcel(messages)
}

export const getLogDataNoTime = async (departmentId) => {
    const messages = await MessageLogDal.getLogNoTime(departmentId)
    return sortLogData(messages)
}

export const addLogDataToArray =  (departments) => {
    const departmentsWithMessages =  departments.map( dep => {
        const messageLog =  sortLogData(dep.message_logs)
        dep.messageLog = messageLog
        return dep
    })
    return departmentsWithMessages
}

const sortLogData = async (messages) => {
  let totalNonTicketMessageDelivered = 0;
  let totalNonTicketSent = 0;
  let totalNonTicketMessageRead = 0;
  let totalNonTicketMessageFailed = 0;
  let totalBlackListMessage = 0;

  for (const message of messages) {
    if (!message.isBlackList && message.Status != "Read" && message.Status != "Accepted") {
      totalNonTicketMessageDelivered++;
    }
    if (!message.isBlackList && message.Status == "Delivered") {
      totalNonTicketSent++;
    }
    if (!message.isBlackList && message.Status == "Read") {
      totalNonTicketMessageRead++;
    }
    if (!message.isBlackList && message.Status == "Rejected") {
      totalNonTicketMessageFailed++;
    }
    if (message.isBlackList){
      totalBlackListMessage++
    }
  }

  const messageLogStats = {
    totalNonTicketMessageDelivered,
    totalNonTicketSent,
    totalNonTicketMessageRead,
    totalNonTicketMessageFailed,
    totalBlackListMessage
  };

  return messageLogStats;
};

  

  const sortLogDataForExcel = async (messages) => {
    const messageToUpdate = []
    const cannedReplies = await DepartmentService.getGlassixCannedReplies(messages[0].departmentId);
    const cannedRepliesText = [];
    const cannedRepliesTitleArray = [];

    for (const reply of cannedReplies) {
      cannedRepliesText.push(reply.text);
      cannedRepliesTitleArray.push(reply.title);
    }

    const logsByProvider = messages.reduce((acc, message) => {
      const { id, ProviderMessageId, Status, Date, To, From, Text, ProtocolType, isBlackList, cannedRepliesTitle } = message;
      const messageId = ProviderMessageId || id;
  
      if (!acc[messageId]) {
        acc[messageId] = {
          To,
          From,
          isBlackList: isBlackList ? "כן" : "לא",
          Text,
          ProtocolType,
          sendTime: '',
          faildTime: '',
          acceptTime: '',
          readTime: '',
          ProviderMessageId: messageId,
          cannedRepliesTitle: ''
        };
      }
  
      if (ProviderMessageId && Status !== 'Read' && Status !== 'Accepted' && !acc[messageId].sendTime) {
        acc[messageId].sendTime = Date || '';
      }
      if ((Status === 'Rejected' || Status === 'Failed') && !acc[messageId].faildTime) {
        acc[messageId].faildTime = Date || '';
      }
      if (Status === 'Delivered' && !acc[messageId].acceptTime) {
        acc[messageId].acceptTime = Date || '';
      }
      if (Status === 'Read' && !acc[messageId].readTime) {
        acc[messageId].readTime = Date || '';
      }
      if (Status === 'Accepted' || Status === 'Rejected' || Status === 'Undelivered(BlackList)') {
        if (cannedRepliesTitle){
        acc[messageId].cannedRepliesTitle = cannedRepliesTitle
        }else{
          const guessedTitle = getCannedRepliesTitle(Text, cannedRepliesText, cannedRepliesTitleArray);
          acc[messageId].cannedRepliesTitle = guessedTitle
          message.cannedRepliesTitle = guessedTitle
          messageToUpdate.push(message.toJSON())
        }
      }
      return acc;
    }, {});

    
    const fixedLog = Object.values(logsByProvider);
    MessageLogDal.updateCannedReplies(messageToUpdate)

    fixedLog.forEach(log => {
      if (!log.cannedRepliesTitle){
        log.cannedRepliesTitle = getCannedRepliesTitle(log.Text, cannedRepliesText, cannedRepliesTitleArray)
      }
    });


    return fixedLog;
  };
  
  
  
  const getCannedRepliesTitle = (text, cannedRepliesText, cannedRepliesTitle) => {
    const closest = levenshtein.closest(text, cannedRepliesText)
    const closetIndex = cannedRepliesText.findIndex(x => x == closest)
    return cannedRepliesTitle[closetIndex]
  }

    const getCannedRepliesTitleEvent = async (departmentId, text) => {
      const cannedReplies = await DepartmentService.getGlassixCannedReplies(departmentId);      
      const cannedRepliesText = [];
      const cannedRepliesTitle = [];

      for (const reply of cannedReplies) {
        cannedRepliesText.push(reply.text);
        cannedRepliesTitle.push(reply.title);
      }

      const closest = levenshtein.closest(text, cannedRepliesText)
      const closetIndex = cannedRepliesText.findIndex(x => x == closest)
      return cannedRepliesTitle[closetIndex]
  }
  
export const deleteMessage = async (payload) => {
    if (!payload.departmentId || !payload.messageId) throw new Error('departmentId or messageId is missing')
    return await MessageLogDal.deleteMessage(payload.departmentId, payload.messageId)
}


 export const deleteOldMessages = async () => {
    Cron.schedule('0 0 * * *', async() => {
        try {
            await MessageLogDal.deleteOldMessages()
        } catch (error) {
            console.log(error);
        }
     })
}


export const getGlassixEvent = async () => {
  setTimeout(getGlassixEvent, 30000); // Repeat every 30 seconds
  try {
    const depKeys = await getAllDepartmentsId();
    for (const department of depKeys) {
      const events = await getEvents(department.id);
      const nonTicketMessageEvent = events.filter(x => x.changes[0]._event === 'NON_TICKET_MESSAGE_STATUS');
      if (nonTicketMessageEvent.length) {
        handleEvent(nonTicketMessageEvent);
      }
      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for 300 milisecond
    }
  } catch (error) {
    logger.error(error);
  }
};




const handleEvent = async(events) => {
    try {
       const sentWhatsAppFaildCount = events.filter(x => x.changes[0].message.status === 'Rejected' && x.changes[0].message.protocolType === 'WhatsApp').length
        const departmentId = events[0].key
        const data = events.map(async event => ({
            Date: event.dateTime,
            From: event.changes[0].message.from,
            To: event.changes[0].message.to,
            Text: event.changes[0].message.text.substring(0, 254),
            Status: event.changes[0].message.status,
            departmentId: event.changes[0].message.departmentId,
            ProtocolType: event.changes[0].message.protocolType,
            isBlackList: false,
            cannedRepliesTitle : event.changes[0].message.status === 'Accepted' ?
             await getCannedRepliesTitleEvent(departmentId, event.changes[0].message.text) : '',
            ProviderMessageId: event.changes[0].message.providerMessageId
        }));
        if (sentWhatsAppFaildCount)
            DepartmentService.updateCountMessage({departmentId, count: sentWhatsAppFaildCount, protocolType: 'WhatsApp'}, 'Incrementing')
        const success = await MessageLogDal.createBulk(data)
        if (success){
                  const queueDetails = events.map(event => ({
                      queueReceiptHandle: event.queueReceiptHandle,
                      queueMessageId: event.queueMessageId
                  }))
                  await deleteEvents(queueDetails, departmentId)
              }
      
    } catch (error) {
        logger.error(error)
    }
}
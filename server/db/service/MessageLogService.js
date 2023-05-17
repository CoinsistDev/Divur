import Cron from 'node-cron'
import levenshtein from 'fastest-levenshtein'
import { getAllDepartmentsId } from '../dal/Deparment.js'
import { getEvents, deleteEvents} from '../../api/controllers/glassix/index.js'
import * as MessageLogDal from '../dal/messageLog.js'
import * as DepartmentService from './DeparmentService.js'
import logger from '../../utils/logger/index.js'

export const addMessageLog = async (webhook) => {
    const message = webhook.changes[0].message
    const data = {
        Date: webhook.dateTime,
        Ticket: false,
        From: message.from,
        To: message.to,
        Text: message.text,
        Status: message.status,
        departmentId: message.departmentId,
        ProtocolType: message.protocolType,
        ProviderMessageId: message.providerMessageId
    }
    return await MessageLogDal.create(data)
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
    const messageLogStats = {
      totalNonTicketMessageDelivered: 0,
      totalNonTicketSent: 0,
      totalNonTicketMessageRead: 0,
      totalNonTicketMessageFailed: 0,
    };
  
    for (const message of messages) {
      if (message.Ticket === false) {
        if (message.Status !== "Read" && message.Status !== "Accepted") {
          messageLogStats.totalNonTicketMessageDelivered++;
        } else if (message.Status === "Delivered") {
          messageLogStats.totalNonTicketSent++;
        } else if (message.Status === "Read") {
          messageLogStats.totalNonTicketMessageRead++;
        } else if (message.Status === "Rejected") {
          messageLogStats.totalNonTicketMessageFailed++;
        }
      }
    }
  
    return messageLogStats;
  };
  

const sortLogDataForExcel = async (messages) => {
    const cannedReplies = await DepartmentService.getGlassixCannedReplies(messages[0].departmentId)
    const cannedRepliesText = cannedReplies.map(x => x.text)
    const cannedRepliesTitle = cannedReplies.map(x => x.title)
    const logsByProvider = messages.reduce((acc, message) => {
      const { ProviderMessageId, Status, Date, To, From, Text, ProtocolType } = message;
      if (!acc[ProviderMessageId]) {
        acc[ProviderMessageId] = {
          To,
          From,
          Text,
          ProtocolType,
          sendTime: '',
          faildTime: '',
          acceptTime: '',
          readTime: '',
          ProviderMessageId,
          cannedRepliesTitle : getCannedRepliesTitle(Text, cannedRepliesText, cannedRepliesTitle)
        };
      }
      if (Status !== 'Read' && Status !== 'Accepted' && !acc[ProviderMessageId].sendTime) {
        acc[ProviderMessageId].sendTime = Date || '';
      }
      if ((Status === 'Rejected' || Status === 'Failed') && !acc[ProviderMessageId].faildTime) {
        acc[ProviderMessageId].faildTime = Date || '';
      }
      if (Status === 'Delivered' && !acc[ProviderMessageId].acceptTime) {
        acc[ProviderMessageId].acceptTime = Date || '';
      }
      if (Status === 'Read' && !acc[ProviderMessageId].readTime) {
        acc[ProviderMessageId].readTime = Date || '';
      }
      return acc;
    }, {});
  
    const fixedLog = Object.values(logsByProvider);
    return fixedLog;
  };
  
  
  const getCannedRepliesTitle = (text, cannedRepliesText, cannedRepliesTitle) => {
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
    console.log('hi');
    try {
        const depKeys = await getAllDepartmentsId()
        await Promise.all(depKeys.map( async department=> {
            const events = await getEvents(department.id)
            const nonTicketMessageEvent = events.filter(x => x.changes[0]._event === 'NON_TICKET_MESSAGE_STATUS')
            if(nonTicketMessageEvent.length) {
                handleEvent(nonTicketMessageEvent)
            }
        }));
    } catch (error) {
        logger.error(error)
    }
     setTimeout(getGlassixEvent, 20000) // Repeat every 20 seconde
}



const handleEvent = async(events) => {
    try {
        // const nonTicketMessageEvent = events.filter(x => x.changes[0]._event === 'NON_TICKET_MESSAGE_STATUS')
       const sentWhatsAppCount = events.filter(x => x.changes[0].message.status === 'Delivered' && x.changes[0].message.protocolType === 'WhatsApp').length
       const sentWhatsAppFaildCount = events.filter(x => x.changes[0].message.status === 'Rejected' && x.changes[0].message.protocolType === 'WhatsApp').length
        const departmentId = events[0].key
        const data = events.map(event => ({
            Date: event.dateTime,
            Ticket: false,
            From: event.changes[0].message.from,
            To: event.changes[0].message.to,
            Text: event.changes[0].message.text.substring(0, 254),
            Status: event.changes[0].message.status,
            departmentId: event.changes[0].message.departmentId,
            ProtocolType: event.changes[0].message.protocolType,
            ProviderMessageId: event.changes[0].message.providerMessageId
        }));
        if (sentWhatsAppFaildCount)
            DepartmentService.updateCountMessage({departmentId, count: sentWhatsAppFaildCount, protocolType: 'WhatsApp'}, 'Incrementing')
            const success = await MessageLogDal.createBulk(data)
            console.log(success);
              if (success){
                  const queueDetails = events.map(event => ({
                      queueReceiptHandle: event.queueReceiptHandle,
                      queueMessageId: event.queueMessageId
                  }))
                  console.log(queueDetails);
                  await deleteEvents(queueDetails, departmentId)
              }
      
    } catch (error) {
        logger.error(error)
    }
}
import * as departmentsController from '../departments/index.js'
import * as blacklistController from '../blacklist/index.js'
import { check, validationResult, matchedData } from "express-validator";
import logger from '../../../utils/logger/index.js'
import { excelToJson } from '../../../utils/excel/index.js';
import { addJobsToQueue } from '../message-queue/index.js';
import { canceldDistribution } from '../message-queue/canceldDistribution.js';



export const sendDistribution = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(500).json({ error: errors.mapped() });
        return;
    }
    const data = matchedData(req);
    data.tags = data.tags  ? JSON.parse(data.tags) : null
    data.Parameters = JSON.parse(data.Parameters)
    logger.info(`Department:${data.departmentId} New Send data:\n from:${data.From}\n parameters:${JSON.stringify(data.Parameters)}\n isNonTicket:${data.isNonTicket}\n tags:${data.tags}\n date:${data.ScheduleDate}\n message:${data.Message}`);
    const department = await departmentsController.getDetails(data.departmentId)
    data.departmentName = department.name
    const blacklist =  (await blacklistController.getAll(data.departmentId)).map(blackObj => blackObj.phone)
    const clientData = await excelToJson(req.file, data.isInternational)
    const clientDataFilter = clientData.filter(x => !blacklist.includes(x.phone) )
    const countMessage = data.protocolType === 'SMS' ? department.remainingSMSMessages : department.remainingMessages
    if (clientDataFilter.length > countMessage) throw new Error(` מספר הלקוחות בקובץ גדול ממספר ההודעות שנותרו בבנק, נא פנה לשירות הלקוחות Consist.Glassix@glassix.support `)
    ValidateParameters(clientDataFilter, data.Parameters, data.Message)
    const response = await addJobsToQueue(clientDataFilter, data)
   res.json(response)
}


const ValidateParameters = (clientData, Parameters, Message) => {
    const testRegex = /[^{{}}]+(?=\})/g
    const messageParameterFromForm = Parameters.map(param => param.messageParameter)
    const paramFromMessage = Message.match(testRegex)
    const fileParameterFromForm = Parameters.map(param => param.fileParameter)
    if (testRegex.test(Message)) {
        if (!Parameters.length)
            throw new Error(`Message contains parameters but not parameter was supplied.`);
        const everyParamExist = paramFromMessage.every(x => messageParameterFromForm.includes(x))
        if (!everyParamExist)
            throw new Error(`Not all parameters in the message body are provided in the parameters array.`);
    }
    console.log(clientData);
    const clientKey = Object.keys(clientData[0])
    fileParameterFromForm.forEach(element => {
        if (!clientKey.includes(element))
        throw new Error(`הפרמטר דינאמי ${element} לא כתוב בדיוק כמו בעמודה בקובץ האקסל שהעליתם למערכת. נא בדיקתכם בשנית.`)
    });

    clientData.forEach((client, index) => {
        const kyesClient = Object.keys(client)
        const everyKeysExist = fileParameterFromForm.every(x => kyesClient.includes(x) && client[x])
        if (!everyKeysExist)
            throw new Error(`File has missing parameters in line ${index + 2}`)
        if (!client.phone)
            throw new Error(`File has missing Phone number at line ${index + 2}`)
    });
}


export const cancelDistribution = async (req, res) => {
    canceldDistribution(req.params.jobId)
    res.sendStatus(200)
}
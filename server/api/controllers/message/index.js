import * as service from '../../../db/service/MessageLogService.js'
import { convertToExcel } from '../../../utils/excel/excel-report.js'
import { sendEmail } from '../../../utils/email/sendEmail.js'
import { verifyToken } from '../../../db/service/UserService.js'
import { getMinimalDetails } from '../departments/index.js'
import { uploadFileFromBuffer, getFileDownloadLink } from '../../../utils/blob-storage/upload-file.js'

export const insertWebhookNonTicket = async (req, res) => {
    const response = await service.addMessageLog(req.body)
    res.send(response)
}

export const getLogData = async (req, res)=> {
    const departmentId = req.params.id
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)
    startDate.setHours(0,0,0,0)
    endDate.setHours(23,59,0,0)
    const response = await service.getLogData(departmentId, startDate, endDate)
    res.send(response)
}

export const getLogDataExcell = async (req, res)=> {
    const token = req.cookies.jwt;
    if (!token) {
      console.log('token is not found');
      return res.sendStatus(401)
    }

    const currentDate = new Date(); // Current date
    const minStartDate = new Date(); // Minimum start date
    let startDate = new Date(req.query.startDate)
    // Set the minimum start date to 4 months ago from the current date
    minStartDate.setMonth(currentDate.getMonth() - 4)
    // Check if the date in startDate is before 4 months ago from the current date
    if (startDate < minStartDate) {
         startDate = minStartDate; // Set the minimum date in case the given date is before 4 months ago
    }
    const departmentId = req.params.id
    const endDate = new Date(req.query.endDate)
    startDate.setHours(0,0,0,0)
    endDate.setHours(23, 59, 59, 999);
    const logData = await service.getLogDataToExcell(departmentId, startDate, endDate)
    const startDateFormat = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
    const endDateFormat = `${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`;
    const { name: departmentName } = await getMinimalDetails(departmentId)
    const fileName = `דוח ממסרים (${departmentName}) ${startDateFormat} - ${endDateFormat}`
    const excellBuffer = await convertToExcel(logData)
    const upload = await uploadFileFromBuffer(fileName + '.xlsx', excellBuffer)
    const excelReportLink = await getFileDownloadLink(fileName + '.xlsx')
    const { email } = await verifyToken(token)
    sendEmail( email, fileName, { excelReportLink }, "./excelReportLink.handlebars");
    res.send(logData)
}

export const deleteMessage = async (req, res)=> {
    const response = await service.deleteMessage(req.params)
    res.send(response)
}
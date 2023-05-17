import * as service from '../../../db/service/BlackListService.js'
import * as mapper from './mapper.js'
import { convertToExcelBlackList } from '../../../utils/excel/excel-report-blacklist.js'
import { check, validationResult, matchedData } from "express-validator";
import { sendEmail } from '../../../utils/email/sendEmail.js'
import { verifyToken } from '../../../db/service/UserService.js'
import { excelToJson } from '../../../utils/excel/index.js';

export const addClient = async (payload) => {
    return mapper.toBlackList(await service.addClient(payload))
}

export const getLogDataExcell = async (req, res)=> {
    const token = req.cookies.jwt;
    if (!token) {
      console.log('token is not found');
      return res.sendStatus(401)
    }
    const departmentId = req.params.id
    const logData = await getAll(departmentId)
    const excellBuffer = await convertToExcelBlackList(logData)
    const { email } = await verifyToken(token)
    sendEmail(email, "דוח הסרה ממערכת דיוור Consist מוכן עבורך!", null, null, excellBuffer);
    res.send(logData)
}

export const getByPhone = async (phoneNumber, departmentId) => {
    return  mapper.toBlackList(await service.getByPhone(phoneNumber, departmentId))
}

export const deleteByPhone = async (phoneNumber, departmentId) => {
    const isDeleted = await service.deleteByPhone(phoneNumber, departmentId)
    return isDeleted
}

export const getAll = async (departmentId, page) => {
    const blacklist = (await service.getAll(departmentId, page)).map(mapper.toBlackList)
    //const blacklist = await service.getAll(departmentId, page)
    return blacklist
}

export const deleteByPk = async (id) => {
    const isDeleted = await service.deleteByPk(id)
    return isDeleted
}

export const getExcellBlacklist = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(500).json({ error: errors.mapped() });
        return;
    }
    const data = matchedData(req);
    const blacklistData = await excelToJson(req.file)
    const blacklist = (await getAll(data.id)).map(blackObj => blackObj.phone)
    const clientDataFilter = blacklistData.filter(x => !blacklist.includes(x.phone) )
    const blackListObj = clientDataFilter.map(x =>  ({phoneNumber: x.phone, departmentId: data.id}))
    if (blackListObj)
        await service.addBulkBlacklist(blackListObj)
   res.json(blackListObj)
}

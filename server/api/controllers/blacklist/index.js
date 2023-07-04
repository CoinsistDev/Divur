import * as service from '../../../db/service/BlackListService.js';
import * as mapper from './mapper.js';
import { convertToExcelBlackList } from '../../../utils/excel/excel-report-blacklist.js';
import { check, validationResult, matchedData } from 'express-validator';
import { sendEmail } from '../../../utils/email/sendEmail.js';
import { verifyToken } from '../../../db/service/UserService.js';
import { excelToJson } from '../../../utils/excel/index.js';
import { getMinimalDetails } from '../departments/index.js';
import { uploadFileFromBuffer, getFileDownloadLink } from '../../../utils/blob-storage/upload-file.js';
import Redis from 'ioredis';

const redis = new Redis({ maxRetriesPerRequest: null });

export const addClient = async (payload) => {
  return mapper.toBlackList(await service.addClient(payload));
};

export const getLogDataExcell = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('token is not found');
    return res.sendStatus(401);
  }
  const departmentId = req.params.id;
  const logData = await getAll(departmentId);
  const excellBuffer = await convertToExcelBlackList(logData);
  const { name: departmentName } = await getMinimalDetails(departmentId);
  const fileName = `דוח הסרה ממערכת דיוור (${departmentName})`;
  const upload = await uploadFileFromBuffer(fileName + '.xlsx', excellBuffer);
  const excelReportLink = await getFileDownloadLink(fileName + '.xlsx');
  const { email } = await verifyToken(token);
  sendEmail(email, fileName, { excelReportLink }, './excelReportLink.handlebars');
  res.send(logData);
};

export const getByPhone = async (phoneNumber, departmentId) => {
  return mapper.toBlackList(await service.getByPhone(phoneNumber, departmentId));
};

export const deleteByPhone = async (phoneNumber, departmentId) => {
  const isDeleted = await service.deleteByPhone(phoneNumber, departmentId);
  return isDeleted;
};

export const getAll = async (departmentId, page = undefined, useCache = false) => {
  const pagePart = page !== undefined ? `:page:${page}` : ':page:undefined';
  const redisKey = `blacklist:${departmentId}${pagePart}`;

  // Try to fetch the result from Redis first
  let blacklist;

  if (useCache) {
    blacklist = await redis.get(redisKey);
    if (blacklist) {
      // Parse the JSON string to JavaScript object before returning
      return JSON.parse(blacklist);
    }
  }

  // If the result was not in Redis or useCache is false, fetch it from the service
  blacklist = (await service.getAll(departmentId, page)).map(mapper.toBlackList);

  // Save the result in Redis, stringify the JavaScript object to JSON string
  if (useCache) {
    await redis.set(redisKey, JSON.stringify(blacklist), 'EX', 120); // 120 seconds = 2 minutes
  }

  return blacklist;
};

export const deleteByPk = async (id) => {
  const isDeleted = await service.deleteByPk(id);
  return isDeleted;
};

export const getExcellBlacklist = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).json({ error: errors.mapped() });
    return;
  }
  const data = matchedData(req);
  const blacklistData = await excelToJson(req.file);
  const blacklist = (await getAll(data.id)).map((blackObj) => blackObj.phone);
  const clientDataFilter = blacklistData.filter((x) => !blacklist.includes(x.phone));
  const blackListObj = clientDataFilter.map((x) => ({ phoneNumber: x.phone, departmentId: data.id }));
  if (blackListObj) await service.addBulkBlacklist(blackListObj);
  res.json(blackListObj);
};

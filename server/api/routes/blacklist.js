import { Router } from 'express'
import asyncHandler from "express-async-handler"
import * as blackListController from '../controllers/blacklist/index.js'
import { isAdmin, authorization, isAdminOrImplementor, isDepartmentUser } from '../../middleware/authMiddleware.js'
import { fileUpload } from '../../utils/multer.js'
import logger from '../../utils/logger/index.js'
import { validateBlacklist } from '../../middleware/validators/index.js'

const blacklistRouter = Router()

blacklistRouter.get('/import-to-excel/:id', authorization, isDepartmentUser, asyncHandler(blackListController.getLogDataExcell))

blacklistRouter.post('/import-from-excel/:id', authorization, isDepartmentUser, fileUpload, validateBlacklist, asyncHandler(blackListController.getExcellBlacklist))

blacklistRouter.get('/findByPhone', asyncHandler(async (req, res) => {
  const query = req.query
  const { departmentId, phoneNumber } = query
  const result = await blackListController.getByPhone(phoneNumber, departmentId)
  res.send(result)
}))

blacklistRouter.delete('/', asyncHandler(async (req, res) => {
  const query = req.query
  const { departmentId, id } = query
  const result = await blackListController.deleteByPk(id)
  //const result = await blackListController.deleteByPhone(phoneNumber, departmentId)
  res.send(result)
}))

blacklistRouter.get('/', asyncHandler(async (req, res) => {
  const query = req.query
  const  {departmentId, page} = query
  const result = await blackListController.getAll( departmentId, page)
  res.send(result)
}))

//  Create
blacklistRouter.put('/', asyncHandler(async (req, res) => {
  const result = await blackListController.addClient(req.query)
  res.status(201).send(result)
}))

//  Create
blacklistRouter.post('/', asyncHandler(async (req, res) => {
  const result = await blackListController.addClient(req.query)
  res.status(201).send(result)
}))


export default blacklistRouter
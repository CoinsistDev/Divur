import { Router } from 'express'
import asyncHandler from "express-async-handler"
import logger from '../../utils/logger/index.js'
import { authorization, isDepartmentUser } from '../../middleware/authMiddleware.js'
import { insertWebhookNonTicket, getLogData, deleteMessage, getLogDataExcell } from '../controllers/message/index.js'


const messageRouter = Router()

messageRouter.post("/", asyncHandler(insertWebhookNonTicket));

messageRouter.get('/:id', asyncHandler(getLogData))

messageRouter.get('/import-to-excel/:id', authorization, isDepartmentUser, asyncHandler(getLogDataExcell))

messageRouter.delete('/:departmentId/:messageId', asyncHandler(deleteMessage))




export default messageRouter
import { Router } from 'express'
import asyncHandler from "express-async-handler"
import { authorization, isDepartmentUser } from '../../middleware/authMiddleware.js'
import { scheduledDistributionReport } from '../controllers/report/index.js'

const reportRouter = Router()

// Send scheduled distribution tasks report to mail
reportRouter.post('/scheduled-distribution-tasks/:id', authorization, isDepartmentUser, asyncHandler(scheduledDistributionReport))

export default reportRouter
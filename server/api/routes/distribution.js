import { Router } from 'express'
import asyncHandler from "express-async-handler"
import { fileUpload } from '../../utils/multer.js'
import logger from '../../utils/logger/index.js'
import { validateSend } from '../../middleware/validators/index.js'
import { sendDistribution, cancelDistribution } from '../controllers/distribution/index.js'

const distributionRouter = Router()

// Send from Glassix
distributionRouter.post("/:departmentId", fileUpload, validateSend, asyncHandler(sendDistribution));

// Cancel Job
distributionRouter.delete("/:jobId", asyncHandler(cancelDistribution));


export default distributionRouter
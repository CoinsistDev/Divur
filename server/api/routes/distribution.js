import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { fileUpload } from '../../utils/multer.js';
import { authorization, isDepartmentUser } from '../../middleware/authMiddleware.js';
import { validateSend } from '../../middleware/validators/index.js';
import { sendDistribution, cancelDistribution } from '../controllers/distribution/index.js';

const distributionRouter = Router();

// Send from Glassix
distributionRouter.post('/:id', authorization, isDepartmentUser, fileUpload, validateSend, asyncHandler(sendDistribution));

// Cancel Job
distributionRouter.delete('/:jobId', asyncHandler(cancelDistribution));

export default distributionRouter;

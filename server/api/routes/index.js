import { Router } from 'express'

import blacklistRouter from './blacklist.js'
import departmentRouter from './department.js'
import distributionRouter from './distribution.js'
import messageRouter from './message.js'
import accountRouter from './account.js'
import reportRouter from './report.js'


const router = Router()

router.use('/blacklist', blacklistRouter)
router.use('/department', departmentRouter)
router.use('/distribution', distributionRouter)
router.use('/message', messageRouter)
router.use('/account', accountRouter)
router.use('/report', reportRouter)


export default router
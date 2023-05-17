import express from "express";
import dotenv from 'dotenv'
import { deleteOldMessages, getGlassixEvent } from './db/service/MessageLogService.js'
import cors from 'cors'
import routes from './api/routes/index.js'
import dbInit from './db/init.js'
import { errorHandler, notFound } from "./middleware/errorMiddlware.js";
import { serverAdapter } from './api/controllers/message-queue/bull-board.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'; 
import compression from 'compression'
import logger from './utils/logger/index.js'

dbInit()

const app = express();

app.use(compression())
app.use(helmet());
app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({limit: '20mb'}));

const PORT = process.env.PORT || 3500

if(process.env.CLUSTER_MASTER == 'true' && process.env.NODE_ENV === 'production'){
    getGlassixEvent()
   deleteOldMessages()
}


app.use('/admin/queues', serverAdapter.getRouter());

app.use('/', routes)

app.use(errorHandler)
app.use(notFound)


app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    console.log('For the UI, open http://localhost:3500/admin/queues');
})
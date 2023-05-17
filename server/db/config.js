import {  Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()


const isDev = process.env.NODE_ENV === 'development'

const dbName = isDev ? process.env.TEST_DB_NAME : process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbHost = process.env.DB_HOST
const dbDriver = process.env.DB_DRIVER
const dbPassword = process.env.DB_PASSWORD


const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
    logging: false,
    pool: {
        max: 2000,
        min: 20,
        maxIdleTime: 800000
    }
})

export default sequelizeConnection

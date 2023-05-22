import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'

import { Department } from './index.js';



const ScheduledDistributionTask = sequelizeConnection.define('scheduled_distribution_task', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    scheduledFor : {
        type: DataTypes.DATE,
    },
    status : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    distributor : {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    distributionTitle : {
        type: DataTypes.STRING,
        defaultValue: ''
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: true
})

Department.hasMany(ScheduledDistributionTask)
ScheduledDistributionTask.belongsTo(Department)

export default ScheduledDistributionTask
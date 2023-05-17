import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'

import { Department } from './index.js';



const MessageLog = sequelizeConnection.define('message_log', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  Date: {
    type: DataTypes.DATE,
  },
  Ticket: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  From: {
    allowNull: false,
    type: DataTypes.STRING
  },
  To: {
    allowNull: false,
    type: DataTypes.STRING
  },
  Text: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  Status: {
    type: DataTypes.STRING
  },
  ProtocolType: {
    allowNull: false,
    type: DataTypes.STRING
  },
  ProviderMessageId: {
    allowNull: false,
    type: DataTypes.STRING
  }
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
 // freezeTableName: true,
  timestamps: false
})

Department.hasMany(MessageLog)
MessageLog.belongsTo(Department)


export default MessageLog
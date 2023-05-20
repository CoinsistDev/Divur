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
  From: {
    allowNull: false,
    type: DataTypes.STRING
  },
  To: {
    allowNull: false,
    type: DataTypes.STRING
  },
  Text: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  cannedRepliesTitle: {
    allowNull: true,
    type: DataTypes.STRING
  },
  Status: {
    type: DataTypes.STRING
  },
  isBlackList: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ProtocolType: {
    allowNull: false,
    type: DataTypes.STRING
  },
  ProviderMessageId: {
    allowNull: true,
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
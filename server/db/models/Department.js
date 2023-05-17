import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'



const Department = sequelizeConnection.define('department', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    remainingMessages: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subDomain: {
        type: DataTypes.STRING,
        defaultValue: 'app',
    },
    apiKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apiSecret: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    remainingSMSMessages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
  //  freezeTableName: true,
})


export default Department
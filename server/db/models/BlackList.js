import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'



const BlackList = sequelizeConnection.define('blacklist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    departmentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: true
 //   freezeTableName: true,
})

export default BlackList
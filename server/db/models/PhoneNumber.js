import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'

import { Department } from './index.js';



const PhoneNumber = sequelizeConnection.define('phone_number', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    PhoneNumber: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    // freezeTableName: true,
    timestamps: false
})

Department.hasMany(PhoneNumber)
PhoneNumber.belongsTo(Department)

export default PhoneNumber
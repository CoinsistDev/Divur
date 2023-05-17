import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'

import { User } from './index.js';


const RefreshToken = sequelizeConnection.define('refresh_token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    // freezeTableName: true,
    timestamps: false
})

User.hasOne(RefreshToken)
RefreshToken.belongsTo(User)

export default RefreshToken
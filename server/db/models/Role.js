import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'


const Role = sequelizeConnection.define('role', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
  //  freezeTableName: true,
    timestamps: false 
})

export default Role
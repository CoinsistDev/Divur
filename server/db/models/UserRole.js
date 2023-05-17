import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'

import { User, Role } from './index.js'



const UserRole = sequelizeConnection.define('user_role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
}, {
  sequelize: sequelizeConnection,
 // freezeTableName: true,
  timestamps: false
})



User.belongsToMany(Role, { through: UserRole })


export default UserRole
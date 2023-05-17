import { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'

import { User, Department } from './index.js'


const UserDepartment = sequelizeConnection.define('user_department', {
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

User.belongsToMany(Department, { through: UserDepartment })
Department.belongsToMany(User, { through: UserDepartment })
User.hasMany(UserDepartment);
UserDepartment.belongsTo(User);
Department.hasMany(UserDepartment);
UserDepartment.belongsTo(Department);

export default UserDepartment
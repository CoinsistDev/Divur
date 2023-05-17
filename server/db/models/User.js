import  { DataTypes } from 'sequelize'
import sequelizeConnection from '../config.js'
import { UserRole, UserDepartment } from './index.js'

const bcryptSalt = process.env.BCRYPT_SALT;


const User = sequelizeConnection.define('user', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastDepartmentVisited: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validator: {
            isEmail: true
        }
    },
    emailConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    concurrencyStamp: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumberConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    lockoutEnd: {
        type: DataTypes.DATE
    },
    lockoutEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    accessFailedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: true,
    hooks: {
        afterCreate: function (user) {
            UserRole.create({ userId: user.id, roleId: 1 });
            UserDepartment.create({ userId: user.id, departmentId: user.lastDepartmentVisited })
        }
    }
})

export default User
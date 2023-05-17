'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastDepartmentVisited: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    emailConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
    },
    concurrencyStamp: {
        type: Sequelize.STRING
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumberConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    twoFactorEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    lockoutEnd: {
        type: Sequelize.DATE
    },
    lockoutEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    accessFailedCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE,
        default: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE
    }
}, {
    paranoid: true,
    hooks: true,
    freezeTableName: true,
    hooks: {
        afterCreate: function (user) {
            'UserRole'.create({ userId: user.id, RoleId: 1 });
            'UserDepartment'.create({userId: user.id, department_Id: user.lastDepartmentVisited })
        }
    }
});

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};
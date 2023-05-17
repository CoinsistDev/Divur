'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDepartment', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      department_Id: {
        type: Sequelize.UUID,
        references: {
          model: 'Department',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserDepartment');
  }
};
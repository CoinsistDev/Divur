'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRole', {
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
      RoleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Role',
          key: 'id'
        }
      }, 
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRole');
  }
};
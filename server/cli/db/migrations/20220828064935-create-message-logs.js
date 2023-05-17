'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessageLog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Date: {
        type: Sequelize.DATE,
        default: Sequelize.NOW
      },
      Ticket: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      From: {
        allowNull: false,
        type: Sequelize.STRING
      },
      To: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Text: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      department_Id: {
        type: Sequelize.UUID,
        references: {
          model: 'Department',
          key: 'id'
        }
      },
      ProtocolType: {
        allowNull: false,
        type: Sequelize.STRING
      }
    }, {
      paranoid: true,
      freezeTableName: true,
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MessageLog');
  }
};
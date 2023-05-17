'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Role', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
  freezeTableName: true,
  paranoid: false,
})
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Role');
  }
};
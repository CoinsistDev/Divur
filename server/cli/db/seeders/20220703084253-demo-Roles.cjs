'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles',
      [
        {
          name: "User"
        },
        {
          name: "Implementor"
        },
        {
          name: "Admin"
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null);

  }
};
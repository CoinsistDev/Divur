'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('phone_numbers',
      [
        {
          id: 1,
          PhoneNumber: '972559728224',
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7"
        },
        {
          id: 2,
          PhoneNumber: '972527502599',
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7"
        },
        {
          id: 3,
          PhoneNumber: '972559728231',
          departmentId: "ce7193ad-b42b-42a2-b39c-e8434da57faa"
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('phone_numbers', null);

  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('refresh_tokens',
      [
        {
          userId: "6cb0db45-4df9-40db-90df-4143e09efff3",
          token: "9684118e-1db2-4c7d-b03b-c2e5a796ff6a",
          expires: new Date()
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('refresh_tokens', null);

  }
};

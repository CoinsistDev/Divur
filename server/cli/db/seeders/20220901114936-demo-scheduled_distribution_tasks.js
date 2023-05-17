'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('scheduled_distribution_tasks',
      [
        {
          scheduledFor: new Date,
          status: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7"
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('scheduled_distribution_tasks', null);

  }
};
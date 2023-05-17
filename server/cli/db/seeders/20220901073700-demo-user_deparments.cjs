'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_departments',
      [
        {
          userId: "6cb0db45-4df9-40db-90df-4143e09efff3",
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
        },
        {
          userId: "6cb0db45-4df9-40db-90df-4143e09efff3",
          departmentId: "ce7193ad-b42b-42a2-b39c-e8434da57faa",
        },
        {
          userId: "c6b7c74d-c60f-4686-8f3c-3406248f4e8d",
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
        },
        {
          userId: "c6b7c74d-c60f-4686-8f3c-3406248f4e8d",
          departmentId: "ce7193ad-b42b-42a2-b39c-e8434da57faa",
        },
        {
          userId: "648a233d-ee3e-4b5d-836f-ab928070f29b",
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
        },
        {
          userId: "648a233d-ee3e-4b5d-836f-ab928070f29b",
          departmentId: "ce7193ad-b42b-42a2-b39c-e8434da57faa",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_departments', null);

  }
};

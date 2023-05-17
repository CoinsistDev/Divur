'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_roles',
      [
        {
          userId: "6cb0db45-4df9-40db-90df-4143e09efff3",
          roleId: 1,
        },
        {
          userId: "6cb0db45-4df9-40db-90df-4143e09efff3",
          roleId: 2,
        },
        {
          userId: "6cb0db45-4df9-40db-90df-4143e09efff3",
          roleId: 3,
        },
        {
          userId: "648a233d-ee3e-4b5d-836f-ab928070f29b",
          roleId: 1,
        },
        {
          userId: "648a233d-ee3e-4b5d-836f-ab928070f29b",
          roleId: 2,
        },
        {
          userId: "648a233d-ee3e-4b5d-836f-ab928070f29b",
          roleId: 3,
        },
        {
          userId: "c6b7c74d-c60f-4686-8f3c-3406248f4e8d",
          roleId: 1,
        },
        {
          userId: "c6b7c74d-c60f-4686-8f3c-3406248f4e8d",
          roleId: 2,
        },
        {
          userId: "c6b7c74d-c60f-4686-8f3c-3406248f4e8d",
          roleId: 3,
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null);

  }
};

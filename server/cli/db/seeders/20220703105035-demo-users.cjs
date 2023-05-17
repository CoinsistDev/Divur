'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users',
      [
        {
          id: "6cb0db45-4df9-40db-90df-4143e09efff3",
          displayName: "נתנאל לוסקי",
          lastDepartmentVisited: "ce7193ad-b42b-42a2-b39c-e8434da57faa",
          userName: "netanell@consist.co.il",
          email: "netanell@consist.co.il",
          emailConfirmed: false,
          passwordHash: "$2b$12$j8J6EcX38w.WP5ZN2k/ppOarXzD.7dqdZxMVMWn8EZobL4uEErT3C",
          concurrencyStamp: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
          phoneNumber: "972528512673",
          phoneNumberConfirmed: false,
          twoFactorEnabled: false,
          lockoutEnd: null,
          lockoutEnabled: true,
          accessFailedCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "648a233d-ee3e-4b5d-836f-ab928070f29b",
          displayName: "לויאור אלפסי",
          lastDepartmentVisited: "ce7193ad-b42b-42a2-b39c-e8434da57faa",
          userName: "leviora@consist.co.il",
          email: "leviora@consist.co.il",
          emailConfirmed: false,
          passwordHash: "$2b$12$j8J6EcX38w.WP5ZN2k/ppOarXzD.7dqdZxMVMWn8EZobL4uEErT3C",
          concurrencyStamp: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
          phoneNumber: "972526470410",
          phoneNumberConfirmed: false,
          twoFactorEnabled: false,
          lockoutEnd: null,
          lockoutEnabled: true,
          accessFailedCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "c6b7c74d-c60f-4686-8f3c-3406248f4e8d",
          displayName: "נעמה אינדיק",
          lastDepartmentVisited: "ce7193ad-b42b-42a2-b39c-e8434da57faa",
          userName: "naamai@consist.co.il",
          email: "naamai@consist.co.il",
          emailConfirmed: false,
          passwordHash: "$2b$12$j8J6EcX38w.WP5ZN2k/ppOarXzD.7dqdZxMVMWn8EZobL4uEErT3C",
          concurrencyStamp: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
          phoneNumber: "972505900765",
          phoneNumberConfirmed: false,
          twoFactorEnabled: false,
          lockoutEnd: null,
          lockoutEnabled: true,
          accessFailedCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null);

  }
};
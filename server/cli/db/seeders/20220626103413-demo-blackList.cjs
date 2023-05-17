
module.exports = {
  up : async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('blacklists',
      [
        { departmentId: 'ce7193ad-b42b-42a2-b39c-e8434da57faa', phoneNumber: '972528512673',
            createdAt: new Date(),
            updatedAt: new Date() },
        { departmentId: 'ce7193ad-b42b-42a2-b39c-e8434da57faa', phoneNumber: '972528512674',
            createdAt: new Date(),
            updatedAt: new Date() },
        { departmentId: 'ce7193ad-b42b-42a2-b39c-e8434da57faa', phoneNumber: '972528512675',
            createdAt: new Date(),
            updatedAt: new Date() },
        { departmentId: 'ce7193ad-b42b-42a2-b39c-e8434da57faa', phoneNumber: '972528512676',
            createdAt: new Date(),
            updatedAt: new Date() },
        { departmentId: 'ce7193ad-b42b-42a2-b39c-e8434da57faa', phoneNumber: '972528512677',
            createdAt: new Date(),
            updatedAt: new Date() },
      ],
      {}
    );
  },

  down : async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('blacklists', null);

  }
};

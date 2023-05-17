'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('message_logs',
      [
        {
          Date: new Date,
          Ticket: false,
          From: '972528512673',
          To: '972528512673',
          Text: 'הי',
          Status: 'Deliverd',
          ProtocolType: "WhatsApp",
          departmentId: "de9178c9-5656-49ab-a547-7f5f1b7b1df7",
          ProviderMessageId : "f65f00e5-c0cf-421e-8f6e-2aa4d320c465"
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('message_logs', null);

  }
};

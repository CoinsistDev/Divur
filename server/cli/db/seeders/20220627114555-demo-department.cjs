'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments',
      [
        {
            id:"9684118e-1db2-4c7d-b03b-c2e5a796ff6a",
            name:"קונסיסט בדיקות",
            remainingMessages : 5000,
            apiKey:"9684118e-1db2-4c7d-b03b-c2e5a796ff6a",
            apiSecret:"U2FsdGVkX19EGxcoxlldI02bNpMFLsxby6/ZVUmT6sGGGke1bX9LoGkMnEUrBFTWHLAxYJ9Bk4es/5aVqvv8IpCuI8aMXw7NYBPovKiIgVmMh0nMUWxS6dI/os/ChIufgungy9mWz02Hgd3X/bJSrEEdTObbcwhEE1ikIz/a3HiLIZ6OQL2KnPmhsND4GKJzHb1Z21NZV13up9txQJC+AA==",
            userName:"api@tests.com",
            remainingSMSMessages : 0,
            subDomain: "app",
            createdAt: new Date(),
            updatedAt: new Date() 
        },
        {
          id:"de9178c9-5656-49ab-a547-7f5f1b7b1df7",
          name:"קונסיסט מכירות",
          remainingMessages : 5000,
          apiKey:"de9178c9-5656-49ab-a547-7f5f1b7b1df7",
          apiSecret:"U2FsdGVkX18OZT376xy/v4VduzlrWHooB4MeTSWA+he/wwfUNxyVH12uX7N0iN+uyJQjpfiDG+WIVUubaG4F+MN6dS9nPI8jhEUFucZCfdcnNmuupIOXpUJHm2xpLmIW/w07MlGloub1OiciwCWNBZ1sTqArbXzRSOBfNLHp3/HOHVUvKc2jNbKabrwljHPx/JAnT89U3GGvTIfM18oQ4g==",
          userName:"api.consist@consist.co.il",
          remainingSMSMessages : 0,
          subDomain: "app",
          createdAt: new Date(),
          updatedAt: new Date() 
      },
      {
        id:"fb11ff13-c613-4238-9c51-0b462d7452f5",
        name:"קונסיסט תמיכה",
        remainingMessages : 0,
        apiKey:"fb11ff13-c613-4238-9c51-0b462d7452f5",
        apiSecret:"U2FsdGVkX19Z84qhjhnfHeI8ofunBcU6sqgpa52mKM7kqILsBm66sdB2fV1Y2w7Jzd2TGtqkQbW4IMa5lLM2NfalH8Mb6q453DFikfss65bEdWNkAnU4H8gAwZAcYktPuLBVzZ6LtMQlOXZ1hS8hWmRw2omgv+7S3lRQbgCP5v71DEx4S2gMFpvN/+2eZO9ka6y2actMxipxkBRetigzRw==",
        userName:"api.consist@consist.co.il",
        remainingSMSMessages : 5000,
        subDomain: "app",
        createdAt: new Date(),
        updatedAt: new Date() 
    },
      {
        id:"ce7193ad-b42b-42a2-b39c-e8434da57faa",
        name:"Consist Test",
        remainingMessages : 100,
        apiKey:"ce7193ad-b42b-42a2-b39c-e8434da57faa",
        apiSecret:"U2FsdGVkX1++V2n2PF7b2kQQKMRlXrduSqyubkUEmwxriahajX9aAz+D0pMqnI8eSimvndu5YWgXn/n/GkOfIdTbee4TToIsOur4al/2m63H3ohcUYb+71wP5z+obrBzEwu+cEVmIs/HkxZGKLeHejDGjFR/99V4ArzJG43EbAy/Omycq7qqOkMLi5w2ToNRFulghqvdCSfGMDzISrBNIg==",
        userName:"api@consistdev.co.il",
        remainingSMSMessages : 5000,
        subDomain: "app",
        createdAt: new Date(),
        updatedAt: new Date() 
    }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null);

  }
};
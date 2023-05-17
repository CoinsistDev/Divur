'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Department', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            remainingMessages: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            apiKey: {
                type: Sequelize.STRING,
                allowNull: true
            },
            apiSecret: {
                type: Sequelize.STRING,
                allowNull: true
            },
            userName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            remainingSMSMessages: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                default: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        }, {
            paranoid: true,
            freezeTableName: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Department');
    }
};
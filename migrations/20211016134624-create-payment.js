'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('Payments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            investmentId: {
                type: Sequelize.INTEGER,
            },
            gateway: {
                type: Sequelize.STRING
            },
            reference: {
                type: Sequelize.STRING,
                allowNull: false
            },
            amount: {
                type: Sequelize.INTEGER,
            },
            transaction_id: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'pending'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Payments');
    }
};

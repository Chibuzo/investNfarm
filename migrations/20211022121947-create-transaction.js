'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
            },
            investment_id: {
                type: Sequelize.INTEGER,
            },
            payment_id: {
                type: Sequelize.INTEGER
            },
            reference: {
                type: Sequelize.STRING
            },
            withdrawal_id: {
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('transactions');
    }
};

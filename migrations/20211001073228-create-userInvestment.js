'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('userInvestments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            UserId: {
                type: Sequelize.INTEGER,
            },
            InvestmentId: {
                type: Sequelize.INTEGER,
            },
            units: {
                type: Sequelize.INTEGER,
                defaultValue: 1
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
        await queryInterface.dropTable('userInvestments');
    }
};

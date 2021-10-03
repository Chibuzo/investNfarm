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
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userInvestments');
    }
};

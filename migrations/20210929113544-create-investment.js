'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('investments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            investment_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            unit_cost: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            country: Sequelize.STRING,
            period: Sequelize.INTEGER,
            units: Sequelize.INTEGER,
            roi: Sequelize.INTEGER,
            active: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('investments');
    }
};

'use strict';

const { sequelize } = require("../models");

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
            about: {
                type: Sequelize.TEXT
            },
            unit_cost: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            country: Sequelize.STRING,
            period: Sequelize.INTEGER,
            units: Sequelize.INTEGER,
            roi: Sequelize.INTEGER,
            photo_url: Sequelize.STRING,
            status: Sequelize.STRING,
            deleted: Sequelize.BOOLEAN,
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

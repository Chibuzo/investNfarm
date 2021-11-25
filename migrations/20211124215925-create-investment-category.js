'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('investmentCategories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            category_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            about: {
                type: Sequelize.TEXT
            },
            benefits: {
                type: Sequelize.TEXT
            },
            model: {
                type: Sequelize.TEXT
            },
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
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('investmentCategories');
    }
};

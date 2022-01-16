'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('countries', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dial_code: Sequelize.STRING,
            code: Sequelize.STRING
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('countries');
    }
};

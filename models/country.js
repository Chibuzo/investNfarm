'use strict';

module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        country: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Country;
}
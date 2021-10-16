'use strict';

module.exports = (sequelize, DataTypes) => {
    const Investment = sequelize.define('Investment', {
        investment_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        about: {
            type: DataTypes.TEXT
        },
        unit_cost: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        period: {
            type: DataTypes.INTEGER,
        },
        units: DataTypes.INTEGER,
        roi: DataTypes.INTEGER,
        photo_url: {
            type: DataTypes.STRING
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {});

    Investment.associate = function (models) {
        Investment.hasMany(models.UserInvestments, { as: 'investors' });
    };

    return Investment;
}
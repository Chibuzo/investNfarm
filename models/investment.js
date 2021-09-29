'use strict';

module.exports = (sequelize, DataTypes) => {
    const Investment = sequelize.define('Investment', {
        investment_name: {
            type: DataTypes.STRING,
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
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {});

    return Investment;
}
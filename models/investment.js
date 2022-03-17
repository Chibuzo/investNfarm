'use strict';

module.exports = (sequelize, DataTypes) => {
    const Investment = sequelize.define('Investment', {
        investment_name: {
            type: DataTypes.STRING,
            allowNull: false
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
        status: {
            type: DataTypes.STRING,
            defaultValue: 'avaliable'
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {});

    Investment.associate = function (models) {
        Investment.belongsToMany(models.User, { through: 'UserInvestments', as: 'investors' });
        Investment.belongsTo(models.InvestmentCategory);
        Investment.hasMany(models.UserInvestments, { as: 'userInvestments' });
    };

    return Investment;
}
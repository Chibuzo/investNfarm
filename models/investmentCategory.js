'use strict';

module.exports = (sequelize, DataTypes) => {
    const InvestmentCategory = sequelize.define('InvestmentCategory', {
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        about: {
            type: DataTypes.TEXT
        },
        benefits: {
            type: DataTypes.TEXT
        },
        model: {
            type: DataTypes.TEXT
        },
        photo_url: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Available' // coming soon/funded/ended
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {});

    InvestmentCategory.associate = function (models) {
        InvestmentCategory.hasMany(models.Investment, { as: 'investments' });
    };

    return InvestmentCategory;
}
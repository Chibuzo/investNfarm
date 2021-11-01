'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
        },
        country: DataTypes.STRING,
        password: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            { unique: true, fields: ['email'] },
            { unique: true, fields: ['phone'] }
        ]
    });

    User.associate = function (models) {
        User.belongsToMany(models.Investment, { through: 'UserInvestments', as: 'investments' });
        User.hasMany(models.UserInvestments);
        User.hasMany(models.Transaction);
    };

    return User;
}
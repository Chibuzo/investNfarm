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
            unique: true,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            unique: true
        },
        country: DataTypes.STRING,
        password: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {});
    User.associate = function (models) {
        // associations can be defined here
    };

    return User;
}
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'admin-user'
        },
        password: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {});

    return Admin;
}
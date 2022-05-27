'use strict';

module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dial_code: DataTypes.STRING,
        code: DataTypes.STRING
    },
        { timestamps: false });

    return Country;
}
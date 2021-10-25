'use strict';

module.exports = (sequelize, DataTypes) => {
    const Withdrawal = sequelize.define('Withdrawal', {
        user_id: {
            type: DataTypes.INTEGER,
        },
        bank: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending'
        }
    }, {});

    return Withdrawal;
}
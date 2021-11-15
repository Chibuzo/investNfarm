'use strict';

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        investmentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Investments',
                key: 'id'
            }
        },
        gateway: {
            type: DataTypes.STRING,
            defaultValue: 'Flutterwave'
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        }
    }, {});

    return Payment;
}
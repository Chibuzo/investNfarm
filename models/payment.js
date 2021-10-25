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
        reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
        }
    }, {});

    return Payment;
}
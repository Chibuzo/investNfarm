'use strict';

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        description: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        investment_id: {
            type: DataTypes.INTEGER,
        },
        payment_id: {
            type: DataTypes.INTEGER
        },
        reference: {
            type: DataTypes.STRING
        },
        withdrawal_id: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        }
    }, {});

    Transaction.associate = function (models) {
        Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
        Transaction.belongsTo(models.Investment, { foreignKey: 'investment_id' });
    };

    return Transaction;
}
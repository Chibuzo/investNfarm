'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserInvestments = sequelize.define('UserInvestments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        InvestmentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Investments',
                key: 'id'
            }
        },
        units: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {});

    UserInvestments.associate = function (models) {
        UserInvestments.belongsTo(models.Investment);
        UserInvestments.belongsTo(models.User);
    };

    return UserInvestments;
}
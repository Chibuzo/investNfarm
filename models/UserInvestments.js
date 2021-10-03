'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserInvestments = sequelize.define('UserInvestments', {
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
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {});

    UserInvestments.associate = function (models) {
        UserInvestments.belongsTo(models.Investment);
        UserInvestments.belongsTo(models.User);
    };

    return UserInvestments;
}
const Investment = require('../models').Investment;
const { ErrorHandler } = require('../helpers/errorHandler');

const create = async investmentData => {
    return Investment.create(investmentData);
}

const view = async id => {
    const investment = await Investment.findOne({ where: { id }, include: 'UserInvestments' });
    const investorsCount = investment.UserInvestments.length;
    const soldUnitCount = investment.UserInvestments.reduce((totalUnits, user) => totalUnits + user.units, 0);
    return { ...investment, investorsCount, soldUnitCount };
}

const list = async (criteria = {}) => {
    const investments = await Investment.findAll({
        where: criteria,
        include: 'investors',
    });

    return investments.map(investment => {
        const soldUnitCount = investment.investors.reduce((totalUnits, user) => totalUnits + user.units, 0);
        return { ...investment.toJSON(), investorCount: investment.investors.length, soldUnitCount };
    });
}

const invest = async ({ userId, investmentId, units = 0 }) => {
    const investment = await Investment.findOne(investmentId);
    if (!investment) throw new ErrorHandler(404, 'Investment not found');

    return investment.createUserInvestments({ userId, investmentId, units });
}

module.exports = {
    create,
    view,
    list,
    invest
}
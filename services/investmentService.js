const Investment = require('../models').Investment;
const { ErrorHandler } = require('../helpers/errorHandler');
const { uploadFile } = require('../helpers/fileUpload');

const create = async ({ body: investmentData, files }) => {
    const photo_url = await uploadFile(files);
    return Investment.create({ ...investmentData, photo_url });
}

const view = async id => {
    const investment = await Investment.findOne({ where: { id }, include: 'investors' });
    return sanitize(investment);
}

const list = async (criteria = {}) => {
    const investments = await Investment.findAll({
        where: criteria,
        include: 'investors',
    });

    return investments.map(investment => sanitize(investment));
}

const invest = async ({ userId: UserId, investmentId: InvestmentId, units = 1 }) => {
    const investment = await Investment.findByPk(InvestmentId);
    if (!investment) throw new ErrorHandler(404, 'Investment not found');

    return investment.createInvestor({ UserId, InvestmentId, units });
}

const sanitize = investment => {
    return {
        ...investment.toJSON(),
        investor_count: investment.investors.length,
        sold_unit_count: investment.investors.reduce((totalUnits, user) => totalUnits + user.units, 0)
    };
}

module.exports = {
    create,
    view,
    list,
    invest
}
const { Investment, Transaction, User } = require('../models');
const { ErrorHandler } = require('../helpers/errorHandler');
const { uploadFile } = require('../helpers/fileUpload');
const walletService = require('../services/walletService');

const save = async ({ body: investmentData, files }) => {
    const photo_url = await uploadFile(files);
    if (investmentData.id) {
        const id = investmentData.id;
        delete investmentData.id;
        if (photo_url) investmentData.photo_url = photo_url;
        return Investment.update(investmentData, { where: { id } });
    }
    return Investment.create({ ...investmentData, photo_url });
}

const view = async id => {
    const investment = await Investment.findOne({ where: { id }, include: 'investors' });
    return sanitize(investment);
}

const list = async (criteria = {}) => {
    const { where = {} } = criteria;
    delete criteria.where;
    where.deleted = false;

    const investments = await Investment.findAll({
        where,
        order: [
            ['createdAt', 'DESC']
        ],
        ...criteria
    });

    return investments.map(investment => sanitize(investment));
}

const getUserInvestments = async user_id => {
    const user = await User.findByPk(user_id);
    return user.getInvestments({ joinTableAttributes: ['units', 'createdAt'], raw: true, nest: true });
}

const invest = async ({ userId: UserId, investmentId: InvestmentId, units = 1 }) => {
    const investment = await Investment.findByPk(InvestmentId);
    if (!investment) throw new ErrorHandler(404, 'Investment not found');

    // check for sufficient balance
    const { balance } = await walletService.fetchTransactions({ where: { user_id: UserId } });
    if (balance < investment.unit_cost * units) {
        throw new ErrorHandler(400, 'You don\'t sufficient balance for this transaction');
    }

    // debit wallet
    await Transaction.create({
        description: 'Investment',
        amount,
        user_id,
        investment_id: investment.id,
        type: 'D',
        status: 'success'
    });

    return investment.createUserInvestment({ UserId, InvestmentId, units });
}

const updateInvestment = async (data) => {
    const id = data.id;
    delete data.id;
    return Investment.update(data, { where: { id } });
}

const sanitize = rawInvestment => {
    const investment = { ...rawInvestment.toJSON() };
    if (investment.investors) {
        investment.investor_count = investment.investors.length;
        investment.sold_unit_count = investment.investors.reduce((totalUnits, user) => totalUnits + user.UserInvestments.units, 0)
    }
    return investment;
}

module.exports = {
    save,
    view,
    list,
    getUserInvestments,
    invest,
    updateInvestment
}
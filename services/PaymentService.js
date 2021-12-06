const { Payment, UserInvestments } = require('../models');

const savePaymentDetails = async ({ flw_ref: reference, amount, status, investmentId, transaction_id, userId }) => {
    await Payment.create({ reference, amount, investmentId, transaction_id, userId, status });
    return UserInvestments.update({ status: 'active' }, { where: { UserId: userId, InvestmentId: investmentId } });
}

module.exports = {
    savePaymentDetails
}
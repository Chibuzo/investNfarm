const Payment = require('../models').Payment;
const investmentService = require('./investmentService');

const savePaymentDetails = async ({ reference, amount, status, investmentId, units, userId }) => {
    await Payment.create({ reference, amount, investmentId, userId, status });

    return investmentService.invest({ userId, investmentId, units });
}

module.exports = {
    savePaymentDetails
}
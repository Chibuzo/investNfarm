const Transaction = require('../models').Transaction;
const Withdrawal = require('../models').Withdrawal;

const fetchTransactions = async criteria => {
    const allTransactions = await Transaction.findAll(criteria);

    let balance = 0;
    const transactions = allTransactions.map(trans => {
        if (trans.status === 'success') {
            if (trans.type === 'C') balance += trans.amount;
            else if (trans.type === 'D') balance -= trans.amount
        }
        return {
            ...trans.toJSON()
        }
    });
    return { transactions, balance };
}

const topUpWallet = async ({ amount, user_id, payment_id = 1 }) => {
    return Transaction.create({
        description: 'topup',
        amount,
        user_id,
        payment_id,
        type: 'C',
        status: 'success'
    });
}

const requestWithdrawal = async ({ bank, account_name, account_number, amount, user_id }) => {
    const withdrawal = await Withdrawal.create({
        user_id, bank, account_name, account_number, amount
    });

    return Transaction.create({
        description: 'withdrawal',
        amount,
        user_id,
        withdrawal_id: withdrawal.id,
        type: 'D'
    });
}

const listWithdrawals = async criteria => {
    const withdrawals = await Withdrawal.findAll(criteria);
    return Promise.all(withdrawals.map(async withdrawal => {
        const { balance } = await fetchTransactions({ where: { user_id: withdrawal.user_id } });
        return {
            ...withdrawal.toJSON(),
            balance
        };
    }));
}

const updateWithdrawal = async ({ id, status }) => {
    const valid_status = ['Approved', 'Cancelled'];
    return valid_status.includes(status) ? Withdrawal.update({ status }, { where: { id } }) : null;
}

module.exports = {
    fetchTransactions,
    topUpWallet,
    requestWithdrawal,
    listWithdrawals,
    updateWithdrawal
}
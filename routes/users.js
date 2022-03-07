const express = require('express');
const router = express.Router();
const investmentService = require('../services/investmentService');
const walletService = require('../services/walletService');

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/dashboard', async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const [investments, userInvestments] = await Promise.all([
            investmentService.list({
                where: { status: 'avaliable' },
                include: ['InvestmentCategory'],
                order: [
                    ['createdAt', 'DESC']
                ]
            }),
            investmentService.getUserInvestments(user_id)
        ]);

        res.render('user/dashboard', { investments, userInvestments });
    } catch (err) {
        next(err);
    }
});

router.get('/portfolio', async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const [investments, userInvestments] = await Promise.all([
            investmentService.list({
                where: { status: 'avaliable' },
                include: ['InvestmentCategory'],
                order: [
                    ['createdAt', 'DESC']
                ]
            }),
            investmentService.getUserInvestments(user_id)
        ]);
        res.render('user/portfolio', { investments, userInvestments });
    } catch (err) {
        next(err);
    }
});

router.get('/wallet', async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const { transactions, balance } = await walletService.fetchTransactions({ where: { user_id } });
        res.render('user/wallet', { transactions, balance });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

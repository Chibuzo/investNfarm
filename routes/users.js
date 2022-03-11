const express = require('express');
const router = express.Router();
const investmentService = require('../services/investmentService');
const walletService = require('../services/walletService');
const { Investment, InvestmentCategory } = require('../models');

const getUserInvestmentCriteria = user_id => {
    return {
        where: { UserId: user_id, status: 'active' },
        include: {
            model: Investment,
            include: {
                model: InvestmentCategory,
                attributes: ['photo_url']
            }
        },
        order: [
            ['createdAt', 'DESC']
        ],
        raw: true,
        nest: true
    };
};

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/dashboard', async (req, res, next) => {
    try {
        const user_id = req.session.user.id;

        const userInvestments = await investmentService.fetchUserInvestments(getUserInvestmentCriteria(user_id));
        res.render('user/dashboard', { userInvestments });
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
            investmentService.fetchUserInvestments(getUserInvestmentCriteria(user_id))
        ]);
        res.render('user/portfolio', { investments, userInvestments });
    } catch (err) {
        next(err);
    }
});

router.get('/wallet', async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const withdrawals = await walletService.listUserWithdrawals({ where: { user_id } });
        res.render('user/wallet', { withdrawals, balance: 0 });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

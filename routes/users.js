const express = require('express');
const router = express.Router();
const User = require('../models').User;
const investmentService = require('../services/investmentService');
const walletService = require('../services/walletService');

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/dashboard', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.session.user.id);
        const [investments, userInvestments] = await Promise.all([
            investmentService.list(),
            user.getInvestments({ joinTableAttributes: ['units', 'createdAt'], raw: true, nest: true })
        ]);

        res.render('user/dashboard', { investments, userInvestments });
    } catch (err) {
        next(err);
    }
});

router.get('/portfolio', async (req, res, next) => {
    try {
        const investments = await investmentService.list();
        const id = req.query.active;
        const selectedInvestment = investments.find(inv => inv.id == id);
        res.render('user/portfolio', { investments, selectedInvestment: selectedInvestment || investments[0] });
    } catch (err) {
        next(err);
    }
});

router.get('/wallet', async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const { transactions, balance } = await walletService.fetchTransactions({ user_id });
        res.render('user/wallet', { transactions, balance });
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

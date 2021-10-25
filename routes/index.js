const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userService = require('../services/userService');
const investmentService = require('../services/investmentService');
const paymentService = require('../services/PaymentService');
const walletService = require('../services/walletService');


router.get('/', async (req, res, next) => {
    try {
        const investments = await investmentService.list();
        res.render('index', { title: 'Welcome', investments });
    } catch (err) {
        next(err);
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/signup', async (req, res, next) => {
    try {
        const newUser = await userService.create(req.body);
        res.render('signup', { title: 'Sign Up', newUser });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        req.session.user = await userService.login(req.body);
        res.redirect('/users/dashboard');
    } catch (err) {
        next(err);
    }
});

router.get('/investment/:id/*', async (req, res, next) => {
    try {
        const investment = await investmentService.view(req.params.id);
        res.render('investment', { investment, title: investment.investment_name });
    } catch (err) {
        next(err);
    }
});

router.post('/confirmpayment', async (req, res, next) => {
    try {
        req.body.userId = req.session.user.id;
        const investment = await paymentService.savePaymentDetails(req.body);
        res.status(200).json({ status: 'success', investment });
    } catch (err) {
        console.log(err)
        next(err);
    }
});

router.post('/wallet/topup', authenticate, async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const transaction = await walletService.topUpWallet({ ...req.body, user_id });
        res.status(200).json({ status: 'success', transaction });
    } catch (err) {
        next(err);
    }
});

router.post('/request-withdrawal', authenticate, async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        await walletService.requestWithdrawal({ ...req.body, user_id });
        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
})

module.exports = router;

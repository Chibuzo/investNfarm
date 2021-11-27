const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const isAuthenticated = require('../middlewares/isAuthenticated');
const userService = require('../services/userService');
const investmentService = require('../services/investmentService');
const paymentService = require('../services/PaymentService');
const walletService = require('../services/walletService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const Country = require('../models').Country;


router.get('/', async (req, res, next) => {
    try {
        const investments = await investmentService.list({
            include: ['investors', 'InvestmentCategory'],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 6
        });
        res.render('new', { title: 'Welcome', investments });
    } catch (err) {
        next(err);
    }
});

router.get('/about', async (req, res, next) => {
    res.render('about1', { title: 'About InvestNFarm' });
});

router.get('/faq', (req, res, next) => {
    res.render('faq', { title: 'Frequently asked Questions' });
});

router.get('/contact', async (req, res, next) => {
    res.render('contact', { title: 'Contact InvestNFarm' });
});

router.get('/signup', async (req, res, next) => {
    try {
        const countries = await Country.findAll({ order: [['country', 'ASC']] });
        res.render('signup', { title: 'Sign Up', countries: countries.map(country => country.toJSON()) });
    } catch (err) {
        next(err);
    }
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
        if (req.query.json == 'true') return res.json({ status: true });
        res.redirect('/users/dashboard');
    } catch (err) {
        next(err);
    }
});

router.get('/projects', isAuthenticated, async (req, res, next) => {
    try {
        const investments = await investmentService.list({
            include: ['investors', 'InvestmentCategory'],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 20
        });
        res.render('portfolio', { title: 'Our Projects', investments });
    } catch (err) {
        next(err);
    }
});

router.post('/invest', authenticate, async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        await investmentService.invest({ ...req.body, userId });
        res.redirect(`/users/portfolio`);
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
});

router.post('/change-payout-status', authenticateAdmin, async (req, res, next) => {
    try {
        await walletService.updateWithdrawal(req.body);
        res.json({ status: true });
    } catch (err) {
        next(err);
    }
});

router.post('/update-investment', authenticateAdmin, async (req, res, next) => {
    try {
        await investmentService.updateInvestment(req.body);
        res.json({ status: true });
    } catch (err) {
        next(err);
    }
});

router.post('/update-investor', authenticateAdmin, async (req, res, next) => {
    try {
        await userService.updateUser(req.body);
        res.json({ status: true });
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

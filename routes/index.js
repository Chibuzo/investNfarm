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
const emailService = require('../services/emailService');
const { ErrorHandler } = require('../helpers/errorHandler');


router.get('/', async (req, res, next) => {
    try {
        const investments = await investmentService.list({
            include: ['investors', 'InvestmentCategory'],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 6
        });
        res.render('index', { title: 'Welcome', investments });
    } catch (err) {
        next(err);
    }
});

router.get('/about', async (req, res, next) => {
    res.render('about', { title: 'About InvestNFarm' });
});

router.get('/faq', (req, res, next) => {
    res.render('faq', { title: 'Frequently asked Questions' });
});

router.get('/terms-and-conditions', (req, res, next) => {
    res.render('terms', { title: "Terms of Agreement" });
});

router.get('/privacy-policy', (req, res, next) => {
    res.render('privacy-policy', { title: "Privacy Policy" });
});

router.get('/contact', async (req, res, next) => {
    res.render('contact', { title: 'Contact InvestNFarm' });
});

router.get('/signup', async (req, res, next) => {
    try {
        const countries = await Country.findAll({ attributes: ['name', 'dial_code'], order: [['name', 'ASC']] });
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
        const user = await userService.login(req.body);
        if (user.status === false) {
            req.session.temp_email = user.email;
            return res.redirect('/user/activate-account?q=inactive')
        }
        req.session.user = user;
        if (req.body.remember_me) {
            req.session.cookie.maxAge = 60 * 60 * 1000 * 24 * 30;   // 30 days
            req.session.user.remember_me = true;
        }
        if (req.query.json == 'true') return res.json({ status: true });
        res.redirect('/users/dashboard');
    } catch (err) {
        next(err);
    }
});

router.get('/activate/:email_hash/:hash_string', async (req, res, next) => {
    try {
        const email_hash = req.params.email_hash;
        const hash_string = req.params.hash_string;
        const user = await userService.activateAccount(email_hash, hash_string);
        res.redirect('/user/activate-account');
    } catch (err) {
        next(err);
    }
});

router.get('/user/activate-account', (req, res) => {
    let user_status = 'active';
    if (req.query.q && req.query.q === 'inactive') {
        user_status = 'inactive';
    }
    res.render('user/activate-account', { user_status });
});

router.get('/resend-verification-email', async (req, res) => {
    const email = req.session.temp_email || '';
    const [user] = await userService.find({ where: { email } });
    emailService.sendConfirmationEmail(user);
    res.end();
});

router.get('/reset-password', async (req, res, next) => {
    res.render('reset-password', { title: 'Reset Password' });
});

router.post('/send-reset-email', async (req, res, next) => {
    try {
        const { email } = req.body;
        const [user] = await userService.find({ where: { email } });
        let message = 'A password reset link has been sent to your email';
        emailService.sendPasswordResetLink(user);
        if (!user) message = 'There is no account associated with this email';
        res.render('reset-password', { title: 'Reset Password', message });
    } catch (err) {
        next(err);
    }
});

router.get('/password-reset/:email_hash/:hash_string', async (req, res, next) => {
    try {
        const email_hash = req.params.email_hash;
        const hash_string = req.params.hash_string;
        const { id, status } = await userService.verifyPasswordResetLink(email_hash, hash_string);
        req.session.reset_password_id = id;
        res.render('password-reset-form', { title: 'Set new password', status });
    } catch (err) {
        next(err);
    }
});

router.post('/reset-password', async (req, res, next) => {
    try {
        if (!req.session.reset_password_id) throw new ErrorHandler(400, 'Invalid operation');
        const { password } = req.body;
        await userService.changePassword(password, req.session.reset_password_id);
        delete req.session.reset_password_id;
        res.render('login', { title: 'Login', message: 'Your password reset was successful.' });
    } catch (err) {
        next(err);
    }
})

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

router.get('/projects/:id/*', isAuthenticated, async (req, res, next) => {
    try {
        const investmentId = req.params.id;
        const shouldFetchFarmInvestments = true;
        const userId = (req.session && req.session.user && req.session.user.id) || null;
        const [investment, userInvestments] = await Promise.all([
            investmentService.view(investmentId, shouldFetchFarmInvestments),
            investmentService.getUserInvestments(userId, { where: { InvestmentId: investmentId, status: 'active' } })
        ]);
        const alreadyInvested = userInvestments && userInvestments.length > 0;

        const investments = investment.investments.filter(inv => inv.id != investmentId);
        res.render('portfolio-page', { title: investment.InvestmentCategory.category_name, investment, investments, alreadyInvested });
    } catch (err) {
        next(err);
    }
});

router.get('/roi-cal', isAuthenticated, async (req, res, next) => {
    try {
        const investments = await investmentService.list({
            where: { status: 'avaliable' },
            include: ['InvestmentCategory'],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.render('roi-cal', { title: 'Calculate ROI', investments, invs: JSON.stringify(investments) });
    } catch (err) {
        next(err);
    }
});

router.post('/invest', authenticate, async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const userInvestment = await investmentService.invest({ ...req.body, userId });
        res.status(200).json({ status: 'success', userInvestment });
    } catch (err) {
        next(err);
    }
});

router.post('/save-payment', authenticate, async (req, res, next) => {
    try {
        req.body.userId = req.session.user.id;
        const investment = await paymentService.savePaymentDetails(req.body);
        res.status(200).json({ status: 'success', investment });
    } catch (err) {
        next(err);
    }
});

// router.post('/wallet/topup', authenticate, async (req, res, next) => {
//     try {
//         const user_id = req.session.user.id;
//         const transaction = await walletService.topUpWallet({ ...req.body, user_id });
//         res.status(200).json({ status: 'success', transaction });
//     } catch (err) {
//         next(err);
//     }
// });

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

router.get('/confirmation', authenticate, async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { inv: investmentId } = req.query;
        const [investment, [userInvestment]] = await Promise.all([
            investmentService.view(investmentId),
            investmentService.getUserInvestments(userId, { where: { InvestmentId: investmentId } })
        ]);
        investment.units_purchased = userInvestment.units;
        res.render('confirmation', { investment });
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

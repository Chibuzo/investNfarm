const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const isAuthenticated = require('../middlewares/isAuthenticated');
const userService = require('../services/userService');
const investmentService = require('../services/investmentService');


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

router.get('/investment/:id/*', isAuthenticated, async (req, res, next) => {
    try {
        const investment = await investmentService.view(req.params.id);
        console.log({ investment })
        res.render('investment', { investment, title: investment.investment_name });
    } catch (err) {
        next(err);
    }
});

router.post('/confirmpayment', async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
});

module.exports = router;

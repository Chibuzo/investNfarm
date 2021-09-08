const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
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

module.exports = router;

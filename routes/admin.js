var express = require('express');
var router = express.Router();
const adminService = require('../services/adminService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const investmentService = require('../services/investmentService');
const walletService = require('../services/walletService');
const userService = require('../services/userService');
const User = require('../models').User;
const Investment = require('../models').Investment;


router.get('/', function (req, res) {
    res.render('admin/login', { title: 'Admin Login' });
});

router.get('/create', (req, res) => {
    res.render('admin/signup', { title: 'Create Admin' });
});

router.post('/create', async (req, res, next) => {
    try {
        await adminService.create(req.body);
        res.render('admin/login', { title: 'New Admin Login' });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        req.session.admin = await adminService.login(req.body);
        res.redirect('/admin/dashboard');
    } catch (err) {
        next(err);
    }
});

router.get('/dashboard', authenticateAdmin, async (req, res, next) => {
    const criteria = {
        where: {
            description: 'withdrawal', status: 'pending'
        },
        attributes: ['id', 'amount', 'status', 'createdAt'],
        include: {
            model: User,
            attributes: ['id', 'fullname']
        }
    };
    const { transactions: withdrawals } = await walletService.fetchTransactions(criteria);
    res.render('admin/dashboard', { withdrawals });
});

router.get('/portfolio', authenticateAdmin, async (req, res, next) => {
    try {
        const investments = await investmentService.list();
        res.render('admin/portfolio', { investments });
    } catch (err) {
        next(err);
    }
});

router.get('/portfolio/new', authenticateAdmin, async (req, res) => {
    res.render('admin/new-portfolio');
});

router.post('/portfolio', authenticateAdmin, async (req, res, next) => {
    try {
        await investmentService.create(req);
        res.redirect('/admin/portfolio');
    } catch (err) {
        next(err);
    }
});

router.get('/transactions', authenticateAdmin, async (req, res, next) => {
    const criteria = {
        attributes: ['id', 'description', 'amount', 'status', 'createdAt'],
        include: [
            {
                model: User,
                attributes: ['id', 'fullname']
            },
            {
                model: Investment,
                attributes: ['id', 'investment_name']
            }
        ]
    };
    try {
        const { transactions } = await walletService.fetchTransactions(criteria);
        res.render('admin/transactions', { transactions });
    } catch (err) {
        next(err);
    }
});

router.get('/investors', authenticateAdmin, async (req, res, next) => {
    try {
        const users = await userService.find({ include: 'UserInvestments' });
        res.render('admin/members', { users });
    } catch (err) {
        next(err);
    }
});

router.get('/payouts', authenticateAdmin, async (req, res, next) => {
    try {
        const criteria = {
            include: {
                model: User,
                attributes: ['id', 'fullname']
            }
        };
        const withdrawals = await walletService.listWithdrawals(criteria);
        res.render('admin/payouts', { withdrawals });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

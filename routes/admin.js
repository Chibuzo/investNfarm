var express = require('express');
var router = express.Router();
const adminService = require('../services/adminService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const investmentService = require('../services/investmentService');


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
    res.render('admin/dashboard', {});
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
        await investmentService.create(req.body);
        res.redirect('/admin/portfolio');
    } catch (err) {
        next(err);
    }
})

module.exports = router;

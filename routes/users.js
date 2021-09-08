var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/dashboard', async (req, res, next) => {
    if (req.session.user && req.session.user.id) {
        res.render('user/dashboard', { user: req.session.user });
    } else {
        next('You don\'t have permission to view this page');
    }
});

module.exports = router;

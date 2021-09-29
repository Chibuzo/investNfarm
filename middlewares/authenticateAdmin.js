module.exports = (req, res, next) => {
    if (req.session.admin && req.session.admin.id) {
        next();
    }

    next(new Error('You don\'t have permission to view this page'));
}
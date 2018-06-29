function checkAuth(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    next();
}


function checkAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    next();
}


module.exports = {
    checkAuth,
    checkAdmin
};
const express = require('express');
const router = express.Router();
let storage = require('./../modules/bd_books');
let check = require('./../modules/check');
router.get("/", (req, res) => {
    res.render('index', {
        user: req.user
    });
});



router.get("/jquery", (req, res) => {
    res.render('jquery', { user: req.user });
});


router.get("/profile", check.checkAuth, (req, res) => {
    res.render('profile', { user: req.user });
});


module.exports = router;
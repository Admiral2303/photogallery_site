const express = require('express');
const router = express.Router();
let storage = require('./../modules/bd_books');
let check = require('./../modules/check');

router.get("/", check.checkAuth, (req, res) => {
    let count = 2;
    storage.findbyName(req.query.name).
    then((arr) => {
        let query = req.query.name;
        let pages = Math.ceil(arr.length / count);
        let currentpage = req.query.page;
        let currentarr = arr.slice((currentpage - 1) * count, currentpage * count);
        let data = {
            pages: pages,
            searchReq: query,
            books: currentarr,
            page: req.query.page,
            user: req.user
        }
        res.render('searchres', data);
    });
});





module.exports = router;
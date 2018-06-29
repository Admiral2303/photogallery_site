const express = require('express');
const router = express.Router();
let storage = require('./../modules/bd_galary');
let check = require('./../modules/check');




router.get("/", (req, res) => {
    storage.get_images()
        .then(images => {
            let data = {
                images: images,
                user: req.user
            }
            res.render('galary', data);
        })
});

router.post("/delete/:id", check.checkAuth, (req, res) => {
    storage.remove(req.params.id);
    res.redirect('/galary');
});

router.get("/add", check.checkAuth, (req, res) => {
    res.render('add', { user: req.user });
});

router.post("/add", check.checkAuth, (req, res) => {
    let image = {
        data: req.files.ava.data,
        mimetype: req.files.ava.mimetype
    }
    storage.create(image);

    res.render('add', { user: req.user });
});

module.exports = router;
const express = require('express');
const router = express.Router();
let storage = require('./../modules/bd_portfolio');
let check = require('./../modules/check');




router.get("/", (req, res) => {

    res.render('portfolio', {
        user: req.user
    });
});



router.get("/add", check.checkAuth, (req, res) => {
    res.render('addtoportfolio', { user: req.user });
});

router.get("/portret", (req, res) => {
    storage.get_images("portret")
        .then(images => {
            let data = {
                images: images,
                user: req.user
            }
            res.render('portfolio1', data);
        })
});

router.get("/family", (req, res) => {
    storage.get_images("family")
        .then(images => {
            let data = {
                images: images,
                user: req.user
            }
            res.render('portfolio1', data);
        })
});

router.get("/marriage", (req, res) => {
    storage.get_images("mariage")
        .then(images => {
            let data = {
                images: images,
                user: req.user
            }
            res.render('portfolio1', data);
        })
});

router.get("/lovestory", (req, res) => {
    storage.get_images("love_story")
        .then(images => {
            let data = {
                images: images,
                user: req.user
            }
            res.render('portfolio1', data);
        })
});


router.post("/add", check.checkAuth, (req, res) => {
    let image = {
        type: req.body.type,
        data: req.files.ava.data,
        mimetype: req.files.ava.mimetype
    }
    storage.create(image);
    res.render('addtoportfolio', { user: req.user });
});


router.post("/delete/:id", check.checkAuth, (req, res) => {
    storage.remove(req.params.id);
    res.redirect('/portfolio');
});

module.exports = router;
const galaryRouter = require('./routes/galary');
const portfolioRouter = require('./routes/portfolio');

let express = require('express');
let bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
let user = require('./modules/bd_user');
let storage = require('./modules/books');
let app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let path = require('path');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(busboyBodyParser({ limit: '5mb' }));
app.use(cookieParser());
app.use(session({
    secret: "Asd",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use("/galary", galaryRouter);
app.use("/portfolio", portfolioRouter);

app.get("/", (req, res) => {
    res.render('index', { user: req.user });
});

app.get("/services", (req, res) => {
    res.render('services', { user: req.user });
});

app.get("/avtorization", (req, res) => {
    console.log(req.user);
    res.render('avtorization', {
        user: req.user
    });
});

app.get("/contact", (req, res) => {
    console.log(req.user);
    res.render('contact', {
        user: req.user
    });
});



const serverSalt = "45%sAlT_";

function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

// console.log(sha512("2281", serverSalt))
// let user1 = {
//     login: "vanya",
//     password: sha512("2281", serverSalt).passwordHash
// }
// user.createUser(user1);

passport.use(new LocalStrategy(
    function(username, password, done) {
        let hash = sha512(password, serverSalt).passwordHash;
        user.getUserByLoginAndPasshash(username, hash)
            .then(user => {
                done(user ? null : false, user);
            });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    user.getUserById(id)
        .then(user => {
            done(user ? null : 'No user', user);
        });
});


app.get('/login',
    (req, res) => res.render('avtorization', {
        user: req.user
    }));

app.get('/logout',
    checkAuth,
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: 'login'
    }));

function checkAuth(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    next();
}













const PORT = 3003;
app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`);
});
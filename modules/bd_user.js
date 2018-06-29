let fs = require('fs');


const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let env = require('node-env-file');
env('./config' + '/.env');

let db = mongoose.connect(process.env.MLAB, {
    useMongoClient: true,
});



let User = db.model('User', {
    login: String,
    password: String
});


async function createUser(user) {
    let newUser = new User({
        login: user.login,
        password: user.password,

    });
    newUser.save();
    return (true);
}




async function getUserByLoginAndPasshash(login, passHash) {
    let user = await User.findOne({ login: login, password: passHash });
    if (user) return user;
    else return null;
}

async function getUserbyLogin(log) {
    let user = await User.findOne({ login: log }).exec();
    return user;
}


async function getUserById(id) {
    let user = await User.findOne({ _id: id });
    if (user) return user;
    else return `User with id ${id} not found`;
}

async function getUsers() {
    let users = await User.find();
    if (users) return users;
    else return `Users not found`;
}


module.exports = {
    createUser,
    getUserbyLogin,
    getUserByLoginAndPasshash,
    getUserById,
    getUsers
}
let fs = require('fs');
const read = require('./read');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let env = require('node-env-file');
env('./config' + '/.env');

let db = mongoose.connect(process.env.MLAB, {
    useMongoClient: true,
});


let ID = db.model('ID', {
    id: String
});

async function create() {
    try {
        let iD = new ID({
            id: "1"
        });
        return await iD.save();
    } catch (err) {
        throw err;
    }
}





async function remove(id) {
    let iD = await getById(id);
    let Id = ID.remove({ _id: id });
    return Id;
}


async function getById(id) {
    let iD = await ID.findOne({ _id: id });
    if (iD) return iD;
    else return `User with _id ${id} not found`;
}

async function get_ids() {
    try {
        let images = await ID.find();
        if (images) return images;
        else return null;
    } catch (err) {
        throw err;
    }
}

async function get_lastID() {
    try {
        let ids = await ID.find();
        let id_ret = ids[ids.length - 1];
        if (id_ret) return id_ret;
        else return null;
    } catch (err) {
        throw err;
    }
}




module.exports = {
    get_lastID,
    get_ids,
    create,
    getById,
    remove
};
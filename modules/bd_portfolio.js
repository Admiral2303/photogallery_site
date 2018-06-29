let fs = require('fs');
let Id = require('./bd_id');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let env = require('node-env-file');
env('./config' + '/.env');

let db = mongoose.connect(process.env.MLAB, {
    useMongoClient: true,
});



function loadImage(mimetype, buffer, id) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(`data:${mimetype};base64,${buffer.toString('base64')}`, { public_id: id }, (err, result) => {
            resolve(result.secure_url);
        });
    });
}

function deleteImage(public_id) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(public_id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

let Portfolio = db.model('Portfolio', {
    portfolio_type: String,
    img_link: String,
    cloud_id: String
});

async function create(data) {
    await Id.create();
    let iD = (await Id.get_lastID())._id;
    let IMG = (await loadImage(data.mimetype, data.data, iD));
    try {
        let portf_type;
        if (data.type == "Портрет") {
            portf_type = "portret";
        } else if (data.type == "Весілля") {
            portf_type = "mariage"
        } else if (data.type == "Сім'я") {
            portf_type = "family"
        } else if (data.type == "Love Story") {
            portf_type = "love_story"
        }
        let newPortfolio = new Portfolio({
            portfolio_type: portf_type,
            img_link: IMG,
            cloud_id: iD
        });
        return await newPortfolio.save();
    } catch (err) {
        throw err;
    }
}


async function get_images(type) {
    try {
        let images = await Portfolio.find({ portfolio_type: type });
        if (images) return images;
        else return null;
    } catch (err) {
        throw err;
    }
}
async function getById(id) {
    let image = await Portfolio.findOne({ _id: id });
    if (image) return image;
    else return `User with _id ${id} not found`;
}


async function remove(id) {
    let img_to_delete = await getById(id);
    await deleteImage(img_to_delete.cloud_id);
    let image = Portfolio.remove({ _id: id });
    return image;
}




module.exports = {
    getById,
    remove,
    create,
    get_images
};
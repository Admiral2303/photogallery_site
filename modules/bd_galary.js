let fs = require('fs');
const read = require('./read');
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

let Image = db.model('Image', {
    image_link: String,
    cloud_id: String
});

async function create(data) {
    await Id.create();
    let iD = (await Id.get_lastID())._id;
    let IMG = (await loadImage(data.mimetype, data.data, iD));
    try {
        let newImage = new Image({
            image_link: IMG,
            cloud_id: iD
        });
        return await newImage.save();
    } catch (err) {
        throw err;
    }
}


async function get_images() {
    try {
        let images = await Image.find();
        if (images) return images;
        else return null;
    } catch (err) {
        throw err;
    }
}


async function remove(id) {
    let img_to_delete = await getById(id);
    await deleteImage(img_to_delete.cloud_id);
    let image = Image.remove({ _id: id });
    return image;
}


async function getById(id) {
    let image = await Image.findOne({ _id: id });
    if (image) return image;
    else return `User with _id ${id} not found`;
}





module.exports = {
    create,
    get_images,
    getById,
    remove
};
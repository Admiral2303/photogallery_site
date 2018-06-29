let read = require('read');
let fs = require('fs');

function readConsole(dataType, defaultValue) {
    return new Promise((resolve, reject) => {
        read({
            prompt: dataType + ": ",
            default: defaultValue
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};


function ReadFile(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, (err, data) => {
            if (err) reject(err);
            else {
                resolve(data.toString()); //.toString()
            }
        });
    });
}

module.exports = {
    readConsole,
    ReadFile
};
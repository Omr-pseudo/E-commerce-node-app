const fs = require('fs');

exports.unlinkOnDelete = (filePath) => {

    fs.unlink(filePath, err => {

        if(err){
            throw (err);
        }
    });

};
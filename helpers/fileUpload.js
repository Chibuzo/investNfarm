const { ErrorHandler } = require('./errorHandler');

const uploadFile = async files => {
    if (!files || Object.keys(files).length === 0) {
        throw new ErrorHandler(400, 'No files were uploaded.');
    }

    // check file type
    const ext = files.portfolio_photo.name.split('.').pop();
    const photoFile = files.portfolio_photo;
    const photoName = `public/portfolio_photos/${process.hrtime()[1]}.${ext}`;
    const uploadPath = require('path').resolve(__dirname, '../', photoName);
    await photoFile.mv(uploadPath);
    return photoName;
}

module.exports = {
    uploadFile
}
// this package allows us to store the parsed data from multer into cloudinary and also have the stored data access for our routes.
// since this package is intergrated with multer so in req.file or files we will have access to the assets we stored in cloduinary.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// associating our cloudinary account with this instance
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'HelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }

});

module.exports = {
    cloudinary,
    storage
}
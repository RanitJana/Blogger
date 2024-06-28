const { v2: cloudinary, UploadStream } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRECT
});

const uploadAvater = async function (filePath, name) {

    const uploadResult = await cloudinary.uploader
        .upload(filePath, { public_id: `${name}` })
        .catch((err) => {
            console.log(err);
        });
    return uploadResult;
}

const uploadCoverImage = async function (filePath, name) {

    const uploadResult = await cloudinary.uploader
        .upload(filePath, { public_id: `${name}` })
        .catch((err) => {
            console.log(err);
        });
    return uploadResult;
}

const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId, (err, res) => {
        if (err) console.log(err);
    });
};

module.exports = {
    uploadAvater,
    uploadCoverImage,
    deleteImage
}
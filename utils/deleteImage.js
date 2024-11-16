// deleteImage.js
const cloudinary = require('./cloudinaryConfig');

async function deleteImage(publicId) {
  await cloudinary.uploader.destroy(publicId)
    .then(result => {
      console.log('Image deleted:', result);
      return result;
    })
    .catch(error => {
      console.error('Error deleting image:', error);
      throw error;
    });
}

module.exports = deleteImage;
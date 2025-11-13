// deleteImage.js
import cloudinary from './cloudinaryConfig';

export default async function deleteImage(publicId) {
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

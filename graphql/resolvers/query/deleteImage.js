const deleteCloudinaryImage = require("../../../utils/deleteImage");

// Define an asynchronous function to generate a cryptographic signature based on the provided 'id'
// The function expects an object with an 'id' property
const deleteImage = async ({ id }, context) => {
  // Create a wrapper of some sort so you don't have to do this on every query
  if(!context?.isAuth) throw new Error("Error generating Signature. You are not authenticated.")
  try{
    await deleteCloudinaryImage(id)
  }catch(e){
    return false
  }
  return true
};


// Export the 'generateSignature' function to make it accessible from other modules
module.exports = { deleteImage };
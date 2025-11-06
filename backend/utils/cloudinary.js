import { v2 as cloudinary } from 'cloudinary'; // here v2 given cloudinary alias name
import fs from 'fs';


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //! upload the file on Cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })

    //! File has been uploaded successfully
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath); //! Remove the locally saved temp file as the upload op got failed
    return null;
  }
}

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw"  // ✅ Important for PDF deletion
    });
    return true;
  } catch (error) {
    console.log("Cloudinary Delete Error:", error);
    return false;
  }
};


export {uploadOnCloudinary}
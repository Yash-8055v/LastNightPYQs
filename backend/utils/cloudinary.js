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

    //! Check if file is PDF
    const isPDF = localFilePath.toLowerCase().endsWith('.pdf');
    
    //! upload the file on Cloudinary
    // Use 'raw' resource_type for PDFs to ensure proper handling
    // Important: Make sure "Show original" and "Raw delivery" are enabled in Cloudinary settings
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: isPDF ? 'raw' : 'auto',
      use_filename: true,
      unique_filename: true,
      // Ensure PDFs are stored as raw files
      format: isPDF ? undefined : undefined, // Let Cloudinary detect format
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
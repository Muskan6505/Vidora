import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET,  
});

const uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath) return null
        // upload file path on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file
        return response;
    }catch(error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary fille as the upload operation got failed
        return null;
    }
}

// const deleteFromCloudinary = async(localFilePath) => {
//     try{
//         if(!localFilePath) return null

//         const response = await cloudinary.uploader.destroy(localFilePath)
//         return response;
//     }catch(error){
//         return null
//     }
// }

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return null;

        // Extract public_id from the Cloudinary URL
        const parts = cloudinaryUrl.split('/');
        const fileWithExt = parts[parts.length - 1];
        const publicId = fileWithExt.split('.')[0]; // remove .jpg, .png, etc.

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return null;
    }
};


export {
    uploadOnCloudinary,
    deleteFromCloudinary
}
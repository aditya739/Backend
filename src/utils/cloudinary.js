import {v2 as cloudinary} from 'cloudinary';

//fs is file system module which is inbuilt module of node js
import fs from 'fs';


 // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });




//uploading the image to cloudinary
//it is an async function because it returns a promise
//it takes the path of the file as an argument

 const uploadOnCloudinary = async(localFilePath)=>{

    //it uploads the file to cloudinary
    try
    {//if file path is not there
        if(!localFilePath)return null
        //uploading the file to cloudinary
       const Response= await cloudinary.uploader.upload(localFilePath, {
            //which type of file is going to upload
            resource_type: "auto"
        })
  //file has been uploaded
  console.log("file has been uploaded successfully",Response.url);
     return Response

    }
catch(error)
{
    fs.unlinkSync(localFilePath);//remove the locally saved temporary file as the upload opration got faild
  return null;
}



 }

 export{uploadOnCloudinary}



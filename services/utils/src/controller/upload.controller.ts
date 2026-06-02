import { Request, Response } from "express";
import cloudinary from "cloudinary"

export const Upload = async(req:Request, res:Response)=>{
    try {
        const {buffer , public_id}= req.body;

        if(public_id){
            await cloudinary.v2.uploader.destroy(public_id)
        }

        const cloud = await cloudinary.v2.uploader.upload(buffer)

        res.json({
            url: cloud.secure_url,
            public_id: cloud.public_id,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}
export default Upload;
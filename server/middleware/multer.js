import multer from 'multer'
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "webm"],
    resource_type: "auto",
  },
});

const parser = multer({ storage })

export default parser
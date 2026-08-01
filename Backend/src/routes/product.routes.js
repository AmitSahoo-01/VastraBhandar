import express from "express";
//  import authenticateSeller middleware for authinticate seller
import {authenticateSeller} from "../middlewares/auth.middleware.js";

// import multer 
import multer from "multer";
//  multer setup
const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    },
    fileFilter:(req,file,cb) => {
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
            cb(null,true);
        }else{
            cb(new Error("Invalid file type"),false);
        }
    }
});


const router = express.Router();

router.post("/",authenticateSeller,upload.array("images",7),createProductValidator,createProduct);

export default router;
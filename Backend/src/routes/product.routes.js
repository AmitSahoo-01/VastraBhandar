import express from "express";
//  import authenticateSeller middleware for authinticate seller
import {authenticateSeller} from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts,getAllProducts,getProductDetails } from "../controller/product.controller.js";
//  import createProductValidator 
import { createProductValidator } from "../validator/product.validator.js";

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

//  post --> api/products/
//  seller create a new prodduct
router.post("/",authenticateSeller,upload.array("images",7),createProductValidator,createProduct);


//  get --> api/products/
//  showing all products created by seller
router.get("/seller-products",authenticateSeller,getSellerProducts);
export default router;

//   get --> api/products/
//  it is the route for public where user can see all the listed products
router.get("/",getAllProducts);


//get  --> api/products/detail/:id
//  it is an route for we can fetch a single product details by id
router.get("/detail/:id",getProductDetails); 
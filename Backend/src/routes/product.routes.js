import express from "express";
//  import authenticateSeller middleware for authinticate seller
import {authenticateSeller} from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts,getAllProducts,getProductDetails,createProductVariants, updateProduct, updateProductVariant, deleteProductVariant } from "../controller/product.controller.js";
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
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp"){
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

//  put --> api/products/:productId
//  seller edit main product details
router.put("/:productId",authenticateSeller,upload.array("images",7),updateProduct);

//  get --> api/products/seller-products
//  showing all products created by seller
router.get("/seller-products",authenticateSeller,getSellerProducts);

//  get --> api/products/
//  it is the route for public where user can see all the listed products
router.get("/",getAllProducts);

//  get --> api/products/detail/:id
//  it is an route for we can fetch a single product details by id
router.get("/detail/:id",getProductDetails);

// post  --> api/products/:productId/variants
//  it is an route where seller can create variants of products
router.post("/:productId/variants",authenticateSeller,upload.array("images",5),createProductVariants);

// put --> api/products/:productId/variants/:variantId
// seller edit an existing variant
router.put("/:productId/variants/:variantId",authenticateSeller,upload.array("images",5),updateProductVariant);

// delete --> api/products/:productId/variants/:variantId
// seller delete an existing variant
router.delete("/:productId/variants/:variantId",authenticateSeller,deleteProductVariant);

export default router;



import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req,res) => {
    const {title,description,priceAmount,priceCurrency} = req.body;
    const seller = req.user;

    //  upload file to server
    const images = await Promise.all(
        req.files.map(async (file)=> {
            const url = await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname,
            });
            return {url};
        })
    );


    try {
        const product = await productModel.create({
            title,
            description,
            seller:seller._id,
            price:{
                amount:priceAmount,
                currency:priceCurrency || "INR"
            },
            images
        });
        
        return res.status(201).json({
            message:"Product created successfully",
            product
        });
    } catch (error) {
        console.error("Error in createProduct controller: ",error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
};


export const getSellerProducts = async(req,res) =>{
    const seller = req.user;

    if(!seller){
        return res.status(404).json({
            message:"Seller not found"
        });
    }

    try {
        const products = await productModel.find({
            seller:seller._id
        });
        return res.status(200).json({
            message:"Seller products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error in getSellerProducts controller: ",error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
};



export const getAllProducts = async (req,res)=>{
    try{
        const products = await productModel.find();
        return res.status(200).json({
            message:"Products fetched successfully",
            products
        });
    }catch(error){
        console.error("Error in getAllProducts controller: ",error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
};


export const getProductDetails = async (req,res) =>{
    const productId = req.params.id;
    try{
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }
        return res.status(200).json({
            message:"Product details fetched successfully",
            product
        });
    }catch(error){
        console.error("Error in getProductDetails controller: ",error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}


export const createProductVariants = async(req,res) => {
    const {productId} = req.params;
    const seller = req.user;

    const product = await productModel.findOne({
        _id:productId,
        seller:seller._id
    });
    if(!product){
        return res.status(404).json({
            message:"Product not found",
            success:false
        });
    }

    const files = req.files;
    const images = [];
    if(files?.length){
        (await Promise.all(files.map(async(file)=>{
            const image = await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname,
            });
            return image
        }))).map(image => images.push({url:image}));
    }
    
    const price = req.body.priceAmount;
    const stock = req.body.stock;
    const attributes = JSON.parse(req.body.attributes || "{}");
    
    product.variants.push({
        images,
        price:{
            amount: Number(price) || product.price?.amount,
            currency:req.body.priceCurrency || product.price?.currency
        },
        stock:stock || product.stock,
        attributes,
    })

    await product.save();
    return res.status(200).json({
        message:"Product variant created successfully",
        product
    });

}
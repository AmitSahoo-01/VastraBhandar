import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req,res) => {
    const {title,description,priceAmount,priceCurrency,stock,color,size} = req.body;
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
                amount: Number(priceAmount),
                currency:priceCurrency || "INR"
            },
            images,
            stock: Number(stock),
            color,
            size
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

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const seller = req.user;
    const { title, description, priceAmount, priceCurrency, stock, color, size } = req.body;

    try {
        const product = await productModel.findOne({
            _id: productId,
            seller: seller._id
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (priceAmount !== undefined) {
            product.price = {
                amount: Number(priceAmount),
                currency: priceCurrency || product.price?.currency || "INR"
            };
        }
        if (stock !== undefined) product.stock = Number(stock);
        if (color !== undefined) product.color = color;
        if (size !== undefined) product.size = size;

        if (req.files?.length) {
            const newImages = await Promise.all(
                req.files.map(async (file) => {
                    const url = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname,
                    });
                    return { url };
                })
            );
            product.images = newImages;
        }

        await product.save();
        return res.status(200).json({ message: "Product updated successfully", product, success: true });
    } catch (error) {
        console.error("Error in updateProduct controller: ", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const updateProductVariant = async (req, res) => {
    const { productId, variantId } = req.params;
    const seller = req.user;

    try {
        const product = await productModel.findOne({
            _id: productId,
            seller: seller._id
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false });
        }

        if (req.body.priceAmount !== undefined) {
            variant.price = {
                amount: Number(req.body.priceAmount),
                currency: req.body.priceCurrency || variant.price?.currency || "INR"
            };
        }
        if (req.body.stock !== undefined) {
            variant.stock = Number(req.body.stock);
        }
        if (req.body.attributes) {
            variant.attributes = JSON.parse(req.body.attributes);
        }

        if (req.files?.length) {
            const newImages = await Promise.all(
                req.files.map(async (file) => {
                    const url = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname,
                    });
                    return { url };
                })
            );
            variant.images = newImages;
        }

        await product.save();
        return res.status(200).json({ message: "Variant updated successfully", product, success: true });
    } catch (error) {
        console.error("Error in updateProductVariant controller: ", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const deleteProductVariant = async (req, res) => {
    const { productId, variantId } = req.params;
    const seller = req.user;

    try {
        const product = await productModel.findOne({
            _id: productId,
            seller: seller._id
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        product.variants.pull({ _id: variantId });
        await product.save();

        return res.status(200).json({ message: "Variant deleted successfully", product, success: true });
    } catch (error) {
        console.error("Error in deleteProductVariant controller: ", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
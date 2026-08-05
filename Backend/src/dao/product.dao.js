import productModel from "../models/product.model.js";

export const getStockOfVariant = async (productId,variantId) => {
    const product = await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    });
    if(!product){
        return null;
    };
    
    const stock = product.variants.find(variant => variant._id.toString() === variantId);
    return stock;
};
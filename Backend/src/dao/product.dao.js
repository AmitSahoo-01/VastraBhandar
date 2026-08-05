import productModel from "../models/product.model.js";

export const getStockOfVariant = async (productId, variantId) => {
    const product = await productModel.findById(productId);
    if (!product) {
        return null;
    }

    if (variantId) {
        const variant = product.variants?.find(v => v._id.toString() === variantId.toString());
        return variant || null;
    }

    return {
        stock: product.stock,
        price: product.price
    };
};
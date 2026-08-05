import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { getStockOfVariant } from "../dao/product.dao.js";


export const addToCart = async (req, res) => {
    const { productId } = req.params;
    const { variantId, quantity = 1 } = req.body;
    const userId = req.user._id;

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (variantId) {
            const hasVariant = product.variants?.some(v => v._id.toString() === variantId.toString());
            if (!hasVariant) {
                return res.status(404).json({
                    success: false,
                    message: "Variant not found"
                });
            }
        }

        const stockObj = await getStockOfVariant(productId, variantId);
        if (!stockObj) {
            return res.status(404).json({
                success: false,
                message: "Stock information not found"
            });
        }

        const availableStock = typeof stockObj.stock === 'number' ? stockObj.stock : 0;

        const cart = (await cartModel.findOne({ user: userId })) || await cartModel.create({ user: userId });

        const existingItem = cart.items.find(item => {
            const isSameProduct = item.product.toString() === productId;
            const isSameVariant = variantId
                ? item.variant?.toString() === variantId
                : !item.variant;
            return isSameProduct && isSameVariant;
        });

        if (existingItem) {
            if (existingItem.quantity + quantity > availableStock) {
                return res.status(400).json({
                    success: false,
                    message: `Stock limit exceeded. Only ${availableStock} item(s) available.`
                });
            }

            existingItem.quantity += quantity;
            await cart.save();

            return res.status(200).json({
                success: true,
                message: "Quantity updated in cart",
                items: cart.items
            });
        }

        if (quantity > availableStock) {
            return res.status(400).json({
                success: false,
                message: `Stock limit exceeded. Only ${availableStock} item(s) available.`
            });
        }

        const newItem = {
            product: productId,
            variant: variantId || null,
            quantity,
            price: stockObj.price
        };

        cart.items.push(newItem);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            items: cart.items
        });

    } catch (error) {
        console.log("Error occur in adding item to cart :", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}




export const getCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await cartModel.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart
        });
    } catch (error) {
        console.log("Error occur in during fetching the cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



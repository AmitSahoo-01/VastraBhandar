import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { getStockOfVariant } from "../dao/product.dao.js";


export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const userId = req.user._id;
    const { quantity=1 } = req.body;
    try {
        const product = await productModel.findOne({
            _id: productId,
            'variants._id': variantId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const stock = await getStockOfVariant(productId,variantId);

        const cart = (await cartModel.findOne({user:userId})) || await cartModel.create({user:userId});

        const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId);

        if(isProductAlreadyInCart){
            const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity;

            if(quantityInCart + quantity > stock){
                return res.status(400).json({
                    success:false,
                    message:"Stock limit exceeded"
                })
            }

            await cartModel.findOneAndUpdate({
                user:userId,
                'items.product':productId,
                'items.variant':variantId
            },{
                $inc:{"items.$.quantity":quantity}
            },{new:true})

            return res.status(200).json({
                success:true,
                message:"Quantity updated in cart"
            });
        }

        if(quantity > stock){
            return res.status(400).json({
                success:false,
                message:"Stock limit exceeded"
            })
        }

        cart.items.push({
            product:productId,
            variant:variantId,
            quantity,
            price:stock.price
        });

        await cart.save();

        return res.status(200).json({
            success:true,
            message:"Product added to cart"
        })


    } catch (error) {
        console.log("Error occur in adding item to cart :",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}




export const getCart = async (req,res) => {
    const userId = req.user._id;
    try {
        const cart = await cartModel.findOne({user:userId}).populate("items.product"); 
        if(!cart){
            return res.status(404).json({
                success:false,
                message:"Cart not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Cart fetched successfully",
            cart
        });
    } catch (error) {
        console.log("Error occur in during fetching the cart:",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}








export { addToCart, getCart };
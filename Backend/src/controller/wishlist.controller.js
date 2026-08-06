import wishlistModel from "../models/wishlist.model.js";
import productModel from "../models/product.model.js";

export const toggleWishlist = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let wishlist = await wishlistModel.findOne({ user: userId });
        if (!wishlist) {
            wishlist = await wishlistModel.create({ user: userId, products: [] });
        }

        const isAlreadyWishlisted = wishlist.products.some(
            (id) => id.toString() === productId.toString()
        );

        if (isAlreadyWishlisted) {
            wishlist.products = wishlist.products.filter(
                (id) => id.toString() !== productId.toString()
            );
        } else {
            wishlist.products.push(productId);
        }

        await wishlist.save();
        await wishlist.populate("products");

        return res.status(200).json({
            success: true,
            message: isAlreadyWishlisted ? "Removed from wishlist" : "Added to wishlist",
            isWishlisted: !isAlreadyWishlisted,
            wishlist: wishlist.products
        });

    } catch (error) {
        console.error("Error toggling wishlist:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getWishlist = async (req, res) => {
    const userId = req.user._id;

    try {
        let wishlist = await wishlistModel.findOne({ user: userId }).populate("products");
        if (!wishlist) {
            wishlist = await wishlistModel.create({ user: userId, products: [] });
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: wishlist.products
        });

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

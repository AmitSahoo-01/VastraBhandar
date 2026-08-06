import { toggleWishlistApi, getWishlistApi } from "../service/wishlist.api.js";
import { useDispatch, useSelector } from "react-redux";
import { setWishlistItems } from "../state/wishlist.slice.js";
import { toast } from "sonner";

export const useWishlist = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const wishlistItems = useSelector((state) => state.wishlist.items) || [];

    async function handleToggleWishlist(productId) {
        if (!user) {
            toast.error("Please login to manage your wishlist");
            return { success: false, requireLogin: true };
        }

        try {
            const data = await toggleWishlistApi(productId);
            if (data?.success) {
                if (data?.wishlist) {
                    dispatch(setWishlistItems(data.wishlist));
                }
                if (data?.message) {
                    toast.success(data.message);
                }
            } else if (data?.message) {
                toast.error(data.message);
            }
            return data;
        } catch (error) {
            toast.error(error?.message || "Error toggling wishlist");
            return error;
        }
    }

    async function handleGetWishlist() {
        if (!user) return;
        try {
            const data = await getWishlistApi();
            if (data?.success && data?.wishlist) {
                dispatch(setWishlistItems(data.wishlist));
            }
            return data;
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            return error;
        }
    }

    const isWishlisted = (productId) => {
        if (!productId || !wishlistItems) return false;
        return wishlistItems.some((item) => {
            const id = typeof item === "string" ? item : item?._id;
            return id === productId;
        });
    };

    return {
        wishlistItems,
        handleToggleWishlist,
        handleGetWishlist,
        isWishlisted
    };
};

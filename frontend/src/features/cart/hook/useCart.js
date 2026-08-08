import { addItem, getCart } from "../service/cart.api.js";
import { useDispatch } from "react-redux";
import { setCart } from "../state/cart.slice.js";
import { toast } from "sonner";


export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({ productId, variantId, quantity = 1 }) {
        try {
            const data = await addItem({ productId, variantId, quantity });
            if (data?.success) {
                await handleGetCart();
                if (data?.message) {
                    toast.success(data.message);
                }
            } else if (data?.message) {
                toast.error(data.message);
            }
            return data;
        } catch (error) {
            toast.error(error?.message || "Error updating cart");
            return error;
        }
    }

    async function handleGetCart() {
        try {
            const data = await getCart();
            if (data?.success && data?.cart) {
                const cartData = Array.isArray(data.cart) ? data.cart[0] : data.cart;
                if (cartData) {
                    dispatch(setCart({
                        items: cartData.items || [],
                        totalAmount: cartData.totalAmount || 0,
                        currency: cartData.currency || "INR"
                    }));
                } else {
                    dispatch(setCart({
                        items: [],
                        totalAmount: 0,
                        currency: "INR"
                    }));
                }
            }
            return data;
        } catch (error) {
            toast.error(error?.message || "Error fetching cart");
            return error;
        }
    }

    return { handleAddItem, handleGetCart };
};
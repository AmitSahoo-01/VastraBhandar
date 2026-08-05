import { addItem } from "../service/cart.api.js";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart } from "../state/cart.slice.js";
import { toast } from "sonner";


export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({ productId, variantId, quantity = 1 }) {
        try {
            const data = await addItem({ productId, variantId, quantity });
            if (data?.items) {
                dispatch(addItemToCart(data.items));
            }
            if (data?.message) {
                toast.success(data.message);
            }
            return data;
        } catch (error) {
            toast.error(error.message);
            return error;
        }
    }

    return { handleAddItem }
}
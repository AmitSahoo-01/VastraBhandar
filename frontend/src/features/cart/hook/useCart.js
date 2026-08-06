import { addItem,getCart } from "../service/cart.api.js";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart, setItems } from "../state/cart.slice.js";
import { toast } from "sonner";


export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({ productId, variantId, quantity = 1 }) {
        try {
            const data = await addItem({ productId, variantId, quantity });
            if (data?.success) {
                if (data?.items) {
                    dispatch(addItemToCart(data.items));
                }
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

    async function handleGetCart(){
        try{
            const data = await getCart();
            if(data?.success && data?.cart){
                dispatch(setItems(data.cart.items));
            }
            return data;
        }catch(error){
            toast.error(error?.message || "Error fetching cart");
            return error;
        }
    }

    return { handleAddItem,handleGetCart }
}
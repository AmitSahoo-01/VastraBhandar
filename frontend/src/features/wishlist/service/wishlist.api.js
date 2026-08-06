import axios from "axios";

const wishlistApi = axios.create({
    baseURL: "http://localhost:3000/api/wishlist",
    withCredentials: true
});

export const toggleWishlistApi = async (productId) => {
    try {
        const response = await wishlistApi.post(`/toggle/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error toggling wishlist item:", error);
        return error.response ? error.response.data : { success: false, message: error.message };
    }
};

export const getWishlistApi = async () => {
    try {
        const response = await wishlistApi.get("/");
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return error.response ? error.response.data : { success: false, message: error.message };
    }
};

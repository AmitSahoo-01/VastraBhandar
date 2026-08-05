import axios from "axios";

const cartApi = axios.create({
    baseURL: "http://localhost:3000/api/cart",
    withCredentials: true
});

export const addItem = async ({ productId, variantId, quantity = 1 }) => {
    try {
        const body = { quantity };
        if (variantId) {
            body.variantId = variantId;
        }
        const response = await cartApi.post(`/add/${productId}`, body);
        return response.data;
    } catch (error) {
        console.log("Error occur in adding item to cart :", error);
        return error.response ? error.response.data : { message: error.message };
    }
};

// export const getCart = async () => {
//     try{
//         const response = await cartApi.get("/");
//         return response.data;
//     }catch(error){
//         console.log("Error occur in fetching the cart :",error);
//         return error.response.data;
//     }
// };
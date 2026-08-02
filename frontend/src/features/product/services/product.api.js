import axios from "axios";

const productApi = axios.create({
    baseURL:"http://localhost:3000/api/products/",
    withCredentials:true,
});


export async function createProduct(formData){
    try{
        const response = await productApi.post("/", formData);
        return response.data;
    }catch(error){
        console.log("Error in createProduct service: ",error);
        throw error;
    }
}

export async function getSellerProducts() {
    try{
        const response = await productApi.get("/seller-products");
        return response.data;
    }catch(error){
        console.log("Error in getSellerProducts service: ",error);
        throw error;
    }
}
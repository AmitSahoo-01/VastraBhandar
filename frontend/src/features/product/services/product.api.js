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


export async function getAllProducts(){
    try{
        const response = await productApi.get("/");
        return response.data;
    }catch(error){
        console.log("Error in getAllProducts service: ",error);
        throw error;
    }
};

export async function getProductDetails(productId){
    try{
        const response = await productApi.get(`/detail/${productId}`);
        return response.data;
    }catch(error){
        console.log("Error in getProductDetails service: ",error);
        throw error;
    }
};


export async function addProductVariant(productId,newProductVariant){
    const formData = new FormData();

    newProductVariant.images.forEach((image)=>{
        formData.append("images",image.file);
    });

    
    formData.append("priceAmount",newProductVariant.priceAmount);
    formData.append("stock",newProductVariant.stock);
    formData.append("attributes",JSON.stringify(newProductVariant.attributes));
    
    try{
        const response = await productApi.post(`/${productId}/variants`,formData);
        return response.data;
    }catch(error){
        console.log("Error in addProductVariant service: ",error);
        throw error;
    }
}
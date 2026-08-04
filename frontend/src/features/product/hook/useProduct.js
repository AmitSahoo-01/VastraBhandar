import { useDispatch } from "react-redux";
import { createProduct,getSellerProducts,getAllProducts,getProductDetails,addProductVariant, updateProduct, updateProductVariant, deleteProductVariant } from "../services/product.api.js";
import { setSellerProducts,setProducts } from "../state/product.slice.js";



export const useProduct = () =>{

    const dispatch = useDispatch();

    async function handleCreateProduct(formData){
        const data = await createProduct(formData);
        return data.product;
    }

    async function handleGetSellerProducts(){
        const data = await getSellerProducts();
        dispatch(setSellerProducts(data.products));
        return data.products;
    }

    async function handleGetAllProducts(){
        const data = await getAllProducts();
        dispatch(setProducts(data.products));
        return data.products;
    }

    async function handleGetProductDetails(productId){
        const data = await getProductDetails(productId);
        return data.product;
    }

    async function handleAddProductVariant(productId,newProductVariant){
        const data = await addProductVariant(productId,newProductVariant);
        return data;
    }

    async function handleUpdateProduct(productId, updateData){
        const data = await updateProduct(productId, updateData);
        return data.product;
    }

    async function handleUpdateProductVariant(productId, variantId, variantData){
        const data = await updateProductVariant(productId, variantId, variantData);
        return data.product;
    }

    async function handleDeleteProductVariant(productId, variantId){
        const data = await deleteProductVariant(productId, variantId);
        return data.product;
    }

    return {
        handleCreateProduct,
        handleGetSellerProducts,
        handleGetAllProducts,
        handleGetProductDetails,
        handleAddProductVariant,
        handleUpdateProduct,
        handleUpdateProductVariant,
        handleDeleteProductVariant
    };
}
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import productReducer from "../features/product/state/product.slice.js";
import cartReducer from "../features/cart/state/cart.slice.js";
import wishlistReducer from "../features/wishlist/state/wishlist.slice.js";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        cart:cartReducer,
        wishlist:wishlistReducer,
    }
})
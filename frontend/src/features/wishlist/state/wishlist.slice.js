import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [], // Array of product objects or IDs
    },
    reducers: {
        setWishlistItems: (state, action) => {
            state.items = action.payload || [];
        },
    }
});

export const { setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;

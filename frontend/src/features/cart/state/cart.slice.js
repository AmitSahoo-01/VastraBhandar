import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalAmount: 0,
        currency: "INR",
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || [];
            state.totalAmount = action.payload?.totalAmount || 0;
            state.currency = action.payload?.currency || "INR";
        },
        setItems: (state, action) => {
            state.items = action.payload || [];
        },
        addItem: (state, action) => {
            state.items = action.payload || [];
        }
    }
});

export const { setCart, setItems, addItem } = cartSlice.actions;

export default cartSlice.reducer;
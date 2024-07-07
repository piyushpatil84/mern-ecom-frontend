import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addOrder } from './orderAPI';

const initialState = {
    order: [],
    status: 'idle',
    currentOrder: null,
};

export const addOrderAsync = createAsyncThunk(
    'order/fetchOrder',
    async (order) => {
        const response = await addOrder(order);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addOrderAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.order.push(action.payload)
                state.currentOrder = action.payload;
            });
    },
});

export const { resetOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;

export default orderSlice.reducer;

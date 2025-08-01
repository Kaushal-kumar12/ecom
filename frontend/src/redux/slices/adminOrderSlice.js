import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// ✅ NEW: Async thunk for updating delivery date
export const updateOrderDeliveryDate = createAsyncThunk(
    "adminOrders/updateOrderDeliveryDate",
    async ({ id, deliveryDate }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}/delivery-date`,
                { deliveryDate },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateOrderExpectedDelivery = createAsyncThunk(
    'adminOrders/updateOrderExpectedDelivery',
    async ({ id, expectedDelivery }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}/expected-delivery`,
                { expectedDelivery },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Update the order delivery status
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updataOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all ordes
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;

                // calculate total sales
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // Update Order Status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            // Delete Order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
            })
            .addCase(updateOrderExpectedDelivery.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderExpectedDelivery.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                state.orders = state.orders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                );
            })
            .addCase(updateOrderExpectedDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle updateOrderDeliveryDate
            .addCase(updateOrderDeliveryDate.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderDeliveryDate.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                state.orders = state.orders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                );
            })
            .addCase(updateOrderDeliveryDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminOrderSlice.reducer;
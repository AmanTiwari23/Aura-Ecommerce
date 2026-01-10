import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Add to cart
export const addToCart = createAsyncThunk("cart/add", async (data, thunkAPI) => {
  try {
    const res = await api.post("/cart", data);
    return res.data; // ✅ backend returns array
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// Get cart
export const getCart = createAsyncThunk("cart/get", async (_, thunkAPI) => {
  try {
    const res = await api.get("/cart");
    return res.data; // ✅ array
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// Update quantity
export const updateCartQty = createAsyncThunk("cart/update", async (data, thunkAPI) => {
  try {
    const res = await api.put("/cart", data);
    return res.data; // ✅ array
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// Remove item
export const removeFromCart = createAsyncThunk("cart/remove", async ({ productId, size }, thunkAPI) => {
  try {
    const res = await api.delete(`/cart/${productId}/${size}`);
    return res.data; // ✅ array
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
    state.items = [];
  },

  },
  extraReducers: (builder) => {
    const safeSet = (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    };

    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, safeSet)

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, safeSet)

      .addCase(updateCartQty.fulfilled, safeSet)
      .addCase(removeFromCart.fulfilled, safeSet)

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;


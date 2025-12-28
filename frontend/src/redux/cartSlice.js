import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const addToCart = createAsyncThunk(
  "cart/add",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/cart", data);
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getCart = createAsyncThunk("cart/get", async (_, thunkAPI) => {
  try {
    const res = await api.get("/cart");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateCartQty = createAsyncThunk(
  "cart/update",
  async (data, thunkAPI) => {
    try {
      const res = await api.put("/cart", data);
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);


export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, size }, thunkAPI) => {
    try {
      const res = await api.delete(`/cart/${productId}/${size}`);
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateCartQty.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;

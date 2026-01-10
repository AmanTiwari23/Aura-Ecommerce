import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const getWishlist = createAsyncThunk("wishlist/get", async () => {
  const res = await api.get("/wishlist");
  return res.data;
});

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId) => {
    const res = await api.post("/wishlist", { productId });
    return res.data;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wishlistSlice.reducer;

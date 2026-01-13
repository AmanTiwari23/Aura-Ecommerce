import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";



export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", formData);
      // We save to localStorage here so refresh works immediately after signup
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", formData);
      // Save to localStorage
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
  } finally {

    localStorage.removeItem("userInfo");
  }
});

export const loadUser = createAsyncThunk("auth/load", async () => {
  const res = await api.get("/auth/me");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Check localStorage on bootup so user stays logged in
    user: localStorage.getItem("userInfo") 
      ? JSON.parse(localStorage.getItem("userInfo")) 
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    // Manual helper to set credentials (e.g., from a profile update)
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    // Important: Clear errors when navigating between login/register pages
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      /* --- Register --- */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Login --- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Logout --- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })

      /* --- Load User --- */
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
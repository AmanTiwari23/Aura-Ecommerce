import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

// --- HELPER: Safely parse localStorage ---
const getUserFromStorage = () => {
  try {
    const storedInfo = localStorage.getItem("userInfo");
    if (!storedInfo || storedInfo === "undefined" || storedInfo === "null") {
      return null;
    }
    return JSON.parse(storedInfo);
  } catch (err) {
    // If parsing fails, clear the bad data
    localStorage.removeItem("userInfo");
    return null;
  }
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", formData);
      // FIX: Save res.data directly (contains _id, token, etc.)
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      return res.data;
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
      // FIX: Save res.data directly (contains _id, token, etc.)
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      return res.data;
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
    // Optional: Reload page to clear any in-memory Redux state completely
    // window.location.href = "/login"; 
  }
});

export const loadUser = createAsyncThunk("auth/load", async () => {
  const res = await api.get("/auth/me");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // FIX: Use the safe helper function instead of direct JSON.parse
    user: getUserFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
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
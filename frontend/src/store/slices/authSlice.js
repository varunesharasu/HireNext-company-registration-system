import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"
import { toast } from "react-toastify"

// Async thunks
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", userData)
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", credentials)
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Login failed"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const verifyMobile = createAsyncThunk("auth/verifyMobile", async ({ userId, otp }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/verify-mobile", { userId, otp })
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Mobile verification failed"
    toast.error(message)
    return rejectWithValue(message)
  }
})

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token")
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      toast.info("Logged out successfully")
    },
    clearError: (state) => {
      state.error = null
    },
    updateUserVerification: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
        localStorage.setItem("token", action.payload.data.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Verify Mobile
      .addCase(verifyMobile.fulfilled, (state) => {
        if (state.user) {
          state.user.is_mobile_verified = true
        }
      })
  },
})

export const { logout, clearError, updateUserVerification } = authSlice.actions
export default authSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axios"
import { toast } from "react-toastify"

// Async thunks
export const registerCompany = createAsyncThunk("company/register", async (companyData, { rejectWithValue }) => {
  try {
    const response = await api.post("/company/register", companyData)
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Company registration failed"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const fetchCompanyProfile = createAsyncThunk("company/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/company/profile")
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      return rejectWithValue("no_profile")
    }
    const message = error.response?.data?.message || "Failed to fetch company profile"
    return rejectWithValue(message)
  }
})

export const updateCompanyProfile = createAsyncThunk(
  "company/updateProfile",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.put("/company/profile", companyData)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update company profile"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const uploadLogo = createAsyncThunk("company/uploadLogo", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("logo", file)

    const response = await api.post("/company/upload-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Logo upload failed"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const uploadBanner = createAsyncThunk("company/uploadBanner", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("banner", file)

    const response = await api.post("/company/upload-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Banner upload failed"
    toast.error(message)
    return rejectWithValue(message)
  }
})

const initialState = {
  profile: null,
  loading: false,
  error: null,
  hasProfile: false,
}

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetCompanyState: (state) => {
      state.profile = null
      state.hasProfile = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Company
      .addCase(registerCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.data
        state.hasProfile = true
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Company Profile
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.data
        state.hasProfile = true
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false
        if (action.payload === "no_profile") {
          state.hasProfile = false
        } else {
          state.error = action.payload
        }
      })
      // Update Company Profile
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload.data
      })
      // Upload Logo
      .addCase(uploadLogo.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.logo_url = action.payload.data.logo_url
        }
      })
      // Upload Banner
      .addCase(uploadBanner.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.banner_url = action.payload.data.banner_url
        }
      })
  },
})

export const { clearError, resetCompanyState } = companySlice.actions
export default companySlice.reducer

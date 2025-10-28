import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { register, login, logout } from "../services/authService";

// Get user from localStorage with profile data
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      // Ensure user has all required fields
      return {
        ...user,
        phone: user.phone || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India"
        },
        profileImage: user.profileImage || null,
        memberSince: user.memberSince || new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

const user = getUserFromStorage();

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await register(userData);
      // Add additional fields for new users
      const completeUserData = {
        ...response,
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India"
        },
        profileImage: null,
        memberSince: new Date().toISOString()
      };
      localStorage.setItem("user", JSON.stringify(completeUserData));
      return completeUserData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await login(email, password);
      // Ensure the user data has all required fields
      const completeUserData = {
        ...response,
        phone: response.phone || "",
        address: response.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India"
        },
        profileImage: response.profileImage || null,
        memberSince: response.memberSince || new Date().toISOString()
      };
      localStorage.setItem("user", JSON.stringify(completeUserData));
      return completeUserData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updatedData, thunkAPI) => {
    try {
      // Get current user from state
      const state = thunkAPI.getState();
      const currentUser = state.auth.user;
      
      // Merge updated data with current user data
      const updatedUser = {
        ...currentUser,
        ...updatedData,
        // Ensure address is properly merged
        address: {
          ...currentUser.address,
          ...updatedData.address
        }
      };
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update profile");
    }
  }
);

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would make an API call here
      // For now, we'll just return success
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to change password");
    }
  }
);

// Async thunk for uploading profile image
export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async (imageData, thunkAPI) => {
    try {
      // Simulate image upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current user
      const state = thunkAPI.getState();
      const currentUser = state.auth.user;
      
      // Update user with new image
      const updatedUser = {
        ...currentUser,
        profileImage: imageData
      };
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to upload image");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    isLoading: false,
    isUpdating: false,
    error: null,
    success: null,
  },
  reducers: {
    logoutUser: (state) => {
      logout();
      state.user = null;
      state.error = null;
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    // Sync update for immediate UI feedback
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          address: {
            ...state.user.address,
            ...action.payload.address
          }
        };
        // Update localStorage immediately
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.user = action.payload;
        state.success = "Profile updated successfully!";
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.success = null;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.success = null;
      })
      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.user = action.payload;
        state.success = "Profile image updated successfully!";
        state.error = null;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

export const { 
  logoutUser, 
  clearError, 
  clearSuccess, 
  updateUserProfile 
} = authSlice.actions;

export default authSlice.reducer;
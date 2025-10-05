// store/slices/userSlice.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  password: string;
  role?: string;
  companyName?: string;
  phone?: string;
  createdAt?: string;
}

export interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface SingupDataResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignupResponse {
  success: string;
  data: SingupDataResponse;
  message: string;
  timestamp: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

// Initial state
const initialState: UserState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("user/login", async (credentials, { rejectWithValue }) => {
  try {
    // Replace with your API endpoint
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Login failed");
    }

    const responsedata = await response.json();
    const data: LoginResponse = responsedata.data;

    // Store tokens in AsyncStorage
    await AsyncStorage.setItem("accessToken", data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});

export const refreshAccessToken = createAsyncThunk<
  TokenRefreshResponse,
  void,
  { state: { user: UserState }; rejectValue: string }
>("user/refreshToken", async (_, { getState, rejectWithValue }) => {
  try {
    const { user } = getState();

    if (!user.refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.refreshToken}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue("Token refresh failed");
    }

    const data: TokenRefreshResponse = await response.json();

    // Update stored access token
    await AsyncStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Token refresh failed");
  }
});

export const loadStoredAuth = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string } | null,
  void,
  { rejectValue: string }
>("user/loadStoredAuth", async (_, { rejectWithValue }) => {
  try {
    const [storedUser, storedAccessToken, storedRefreshToken] =
      await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("accessToken"),
        AsyncStorage.getItem("refreshToken"),
      ]);

    if (storedUser && storedAccessToken && storedRefreshToken) {
      return {
        user: JSON.parse(storedUser),
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      };
    }

    return null;
  } catch (error: any) {
    return rejectWithValue("Failed to load stored authentication");
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: { user: UserState }; rejectValue: string }
>("user/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const { user } = getState();

    // Call logout API if token exists
    if (user.accessToken) {
      await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
    }

    // Clear AsyncStorage
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
  } catch (error: any) {
    // Even if API call fails, we still want to clear local storage
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    return rejectWithValue("Logout completed with errors");
  }
});

export const pingAuth = createAsyncThunk<
  void,
  void,
  { state: { user: UserState }; rejectedValue: string }
>("user/pingAuth", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const { user } = getState();

    const accessToken = user.accessToken;
    const refreshToken = user.refreshToken;

    if (!accessToken) {
      return rejectWithValue("No access token found");
    }

    // 1️⃣ Ping your backend
    const response = await fetch(`${process.env.BACKEND_URL}/auth/ping`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      console.log("✅ Access token still valid");
      return;
    }

    // 2️⃣ Access token expired, try refreshing
    console.log("⚠️ Access token expired — refreshing...");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const refreshResponse = await fetch(
`${process.env.BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshResponse.ok) {
      // ❌ Refresh token invalid → logout user
      console.log("🚫 Refresh token invalid — forcing logout");
      await AsyncStorage.clear();
      dispatch(clearAuth());
      return rejectWithValue("Invalid refresh token");
    }

    const newTokens = await refreshResponse.json();

    // ✅ Store new tokens
    await AsyncStorage.setItem("accessToken", newTokens.data.accessToken);
    await AsyncStorage.setItem("refreshToken", newTokens.data.refreshToken);

    dispatch(
      setTokens({
        accessToken: newTokens.data.accessToken,
        refreshToken: newTokens.data.refreshToken,
      })
    );

    console.log("✅ Tokens refreshed successfully");
  } catch (error: any) {
    console.log("❌ PingAuth failed:", error);
    await AsyncStorage.clear();
    dispatch(clearAuth());
    return rejectWithValue(error.message || "Ping or token refresh failed");
  }
});

export const SignupUser = createAsyncThunk<
  SignupResponse,
  SignupCredentials,
  { rejectValue: string }
>("user/Signup", async (Credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(
`${process.env.BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Credentials),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Signup Failed");
    }

    const data: SignupResponse = await response.json();

    if (
      !data?.data?.accessToken ||
      !data?.data?.refreshToken ||
      !data?.data?.user
    ) {
      return rejectWithValue("Invalid response from server");
    }

    // ✅ Store tokens & user info in AsyncStorage
    await AsyncStorage.setItem("accessToken", data.data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.data.refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(data.data.user));

    // ✅ Return the response to update Redux state
    return data;
  } catch (error: any) {
    console.log("Authorization failed", error);
    return rejectWithValue(
      error?.message || "Network error — please check your internet connection"
    );
  }
});

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update user info
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update AsyncStorage
        AsyncStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    // Set tokens manually (useful for social login)
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    // Clear auth state
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.lastLogin = new Date().toISOString();
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Token refresh cases
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Load stored auth cases
      .addCase(loadStoredAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadStoredAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

// Export actions
export const { clearError, updateUser, setTokens, clearAuth } =
  userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
export const selectAccessToken = (state: { user: UserState }) =>
  state.user.accessToken;
export const selectRefreshToken = (state: { user: UserState }) =>
  state.user.refreshToken;
export const selectIsLoading = (state: { user: UserState }) =>
  state.user.isLoading;
export const selectError = (state: { user: UserState }) => state.user.error;
export const selectLastLogin = (state: { user: UserState }) =>
  state.user.lastLogin;

// Export reducer
export default userSlice.reducer;

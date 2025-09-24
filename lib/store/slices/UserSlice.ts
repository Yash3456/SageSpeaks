// store/slices/userSlice.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
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
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Replace with your API endpoint
      const response = await fetch('YOUR_API_BASE_URL/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      
      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const refreshAccessToken = createAsyncThunk<
  TokenRefreshResponse,
  void,
  { state: { user: UserState }; rejectValue: string }
>(
  'user/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      
      if (!user.refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await fetch('YOUR_API_BASE_URL/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.refreshToken}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Token refresh failed');
      }

      const data: TokenRefreshResponse = await response.json();
      
      // Update stored access token
      await AsyncStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const loadStoredAuth = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string } | null,
  void,
  { rejectValue: string }
>(
  'user/loadStoredAuth',
  async (_, { rejectWithValue }) => {
    try {
      const [storedUser, storedAccessToken, storedRefreshToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
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
      return rejectWithValue('Failed to load stored authentication');
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: { user: UserState }; rejectValue: string }
>(
  'user/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      
      // Call logout API if token exists
      if (user.accessToken) {
        await fetch('YOUR_API_BASE_URL/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });
      }
      
      // Clear AsyncStorage
      await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    } catch (error: any) {
      // Even if API call fails, we still want to clear local storage
      await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
      return rejectWithValue('Logout completed with errors');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
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
        AsyncStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    
    // Set tokens manually (useful for social login)
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
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
        state.error = action.payload || 'Login failed';
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
export const { clearError, updateUser, setTokens, clearAuth } = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectAccessToken = (state: { user: UserState }) => state.user.accessToken;
export const selectRefreshToken = (state: { user: UserState }) => state.user.refreshToken;
export const selectIsLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectError = (state: { user: UserState }) => state.user.error;
export const selectLastLogin = (state: { user: UserState }) => state.user.lastLogin;

// Export reducer
export default userSlice.reducer;
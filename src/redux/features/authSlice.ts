// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { AuthResponse, RolePermission, User } from '../../types/auth';

export interface AuthState {
  user: User | null;
  rolePermissions: RolePermission[];
  isAuthenticated: boolean;
  currentlyActiveAsRole: string | null;
  availableRoles: string[];
  loading: boolean;
  error: string | null;
  signupMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  rolePermissions: [],
  isAuthenticated: false,
  currentlyActiveAsRole: null,
  availableRoles: [],
  loading: false,
  error: null,
  signupMessage: null,
};

export function generateRoleArray(primaryRole: string): string[] {
  const role = primaryRole.toLowerCase();
  if (role === 'admin') {
    return ['admin', 'vendor', 'customer'];
  } else if (role === 'service provider') {
    return ['vendor', 'customer'];
  } else if (role === 'customer') {
    return ['customer', 'vendor'];
  }
  return [role];
}

// New Thunk: Check and Refresh Tokens
export const checkAndRefreshToken = createAsyncThunk<
  boolean, // Returns true if session is valid, false otherwise
  void,
  { rejectValue: string }
>('auth/checkAndRefreshToken', async (_, thunkAPI) => {
  try {
    const refreshCredentials = await Keychain.getInternetCredentials(
      'refreshToken',
    );
    if (!refreshCredentials) {
      return false; // No refresh token, session invalid
    }

    // Try fetching user details with existing access token
    const tokenCredentials = await Keychain.getInternetCredentials(
      'accessToken',
    );
    if (tokenCredentials) {
      try {
        await thunkAPI.dispatch(fetchUserDetails()).unwrap();
        return true; // Access token is valid
      } catch (error) {
        // Access token might be expired, try refreshing
      }
    }

    // Attempt to refresh access token
    await thunkAPI.dispatch(refreshAccessToken()).unwrap();
    await thunkAPI.dispatch(fetchUserDetails()).unwrap();
    return true; // Successfully refreshed and fetched user details
  } catch (error: any) {
    return false; // Both tokens invalid or refresh failed
  }
});

// Fetch User Details Thunk
export const fetchUserDetails = createAsyncThunk<
  {
    currentlyActiveAsRole: string | null;
    availableRoles: string[];
    user: User;
    rolePermissions: RolePermission[];
  },
  void,
  { rejectValue: string }
>('auth/fetchUserDetails', async (_, thunkAPI) => {
  try {
    const tokenCredentials = await Keychain.getInternetCredentials(
      'accessToken',
    );
    if (!tokenCredentials) {
      return thunkAPI.rejectWithValue('No access token found');
    }

    const response = await axios.get<AuthResponse>(
      'https://podiumapp.site/server/auth/me',
      {
        headers: { Authorization: `Bearer ${tokenCredentials.password}` },
      },
    );

    const { user: actualUser, rolePermissions } = response.data.user;
    const primaryRoleName = actualUser.userRoles[0].role.name;
    const generatedRoles = generateRoleArray(primaryRoleName);
    const activeRole = generatedRoles[0];
    actualUser.currentlyActiveAsRole = activeRole;

    return {
      user: actualUser,
      rolePermissions,
      availableRoles: generatedRoles,
      currentlyActiveAsRole: activeRole,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch user details',
    );
  }
});

// Login Thunk
export const loginUser = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
    user: User;
    message: string;
  },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (loginData, thunkAPI) => {
  try {
    const response = await axios.post<{
      message: string;
      user: Partial<User>;
      accessToken: string;
      refreshToken: string;
    }>('https://podiumapp.site/server/auth/login', loginData);

    const { accessToken, refreshToken, user, message } = response.data;
    await Keychain.setInternetCredentials(
      'accessToken',
      'accessToken',
      accessToken,
    );
    await Keychain.setInternetCredentials(
      'refreshToken',
      'refreshToken',
      refreshToken,
    );

    // Fetch full user details after login
    await thunkAPI.dispatch(fetchUserDetails()).unwrap();

    return { accessToken, refreshToken, message, user: user as User };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Login failed',
    );
  }
});

// Signup Thunk
export const signupUser = createAsyncThunk<
  string,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/signupUser', async (signupData, thunkAPI) => {
  try {
    const response = await axios.post<{ message: string }>(
      'https://podiumapp.site/server/auth/signup',
      signupData,
    );
    return response.data.message;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Signup failed',
    );
  }
});

// Refresh Token Thunk
export const refreshAccessToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>('auth/refreshAccessToken', async (_, thunkAPI) => {
  try {
    const refreshCredentials = await Keychain.getInternetCredentials(
      'refreshToken',
    );
    if (!refreshCredentials) {
      return thunkAPI.rejectWithValue('No refresh token available');
    }
    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>('https://podiumapp.site/server/auth/refresh', {
      refreshToken: refreshCredentials.password,
    });
    const { accessToken, refreshToken } = response.data;
    await Keychain.setInternetCredentials(
      'accessToken',
      'accessToken',
      accessToken,
    );
    await Keychain.setInternetCredentials(
      'refreshToken',
      'refreshToken',
      refreshToken,
    );
    return { accessToken, refreshToken };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Token refresh failed',
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.rolePermissions = [];
      state.currentlyActiveAsRole = null;
      state.availableRoles = [];
      state.signupMessage = null;
      Keychain.resetInternetCredentials('accessToken');
      Keychain.resetInternetCredentials('refreshToken');
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateActiveRoleByIndex(state, action: PayloadAction<number>) {
      if (
        state.availableRoles &&
        state.availableRoles.length > action.payload
      ) {
        state.currentlyActiveAsRole = state.availableRoles[action.payload];
      }
    },
  },
  extraReducers: builder => {
    builder
      // Check and Refresh Token cases
      .addCase(checkAndRefreshToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAndRefreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload;
      })
      .addCase(checkAndRefreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to validate session';
        state.isAuthenticated = false;
        state.user = null;
        state.rolePermissions = [];
        state.currentlyActiveAsRole = null;
        state.availableRoles = [];
      })
      // Login cases
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Fetch User cases
      .addCase(fetchUserDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.rolePermissions = action.payload.rolePermissions;
        state.isAuthenticated = true;
        state.availableRoles = action.payload.availableRoles;
        state.currentlyActiveAsRole = action.payload.currentlyActiveAsRole;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user details';
        state.isAuthenticated = false;
        state.user = null;
        state.rolePermissions = [];
        state.currentlyActiveAsRole = null;
        state.availableRoles = [];
      })
      // Signup cases
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.signupMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.signupMessage = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      // Token refresh cases
      .addCase(refreshAccessToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, state => {
        state.loading = false;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Token refresh failed';
        state.isAuthenticated = false;
        state.user = null;
        state.rolePermissions = [];
        state.currentlyActiveAsRole = null;
        state.availableRoles = [];
      });
  },
});

export const { logout, setUser, updateActiveRoleByIndex } = authSlice.actions;
export default authSlice.reducer;



import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {AuthResponse, RolePermission, User} from '../../types/auth';

export interface AuthState {
  user: User | null;
  rolePermissions: RolePermission[];
  isAuthenticated: boolean;
  currentlyActiveAsRole: string | null;
  availableRoles: string[];
  loading: boolean;
  error: string | null;
  signupMessage: string | null; // To store signup success message
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
  // Normalize to lowercase for consistent comparison
  const role = primaryRole.toLowerCase();
  if (role === 'admin') {
    // For admin, return an array with primary role and add vendor and customer.
    return ['admin', 'vendor', 'customer'];
  } else if (role === 'service provider') {
    // For service provider, return array with vendor (replacing "service provider") and customer.
    return ['vendor', 'customer'];
  } else if (role === 'customer') {
    // For customer, return array with primary role and add vendor.
    return ['customer', 'vendor'];
  }
  // Default: just return the primary role.
  return [role];
}

//!======================================== Fetch User thunk =====================================
export const fetchUserDetails = createAsyncThunk<
  {
    currentlyActiveAsRole: string | null;
    availableRoles: string[];
    user: User;
    rolePermissions: RolePermission[];
  },
  void,
  {rejectValue: string}
>('auth/fetchUserDetails', async (_, thunkAPI) => {
  try {
    // Retrieve access token from Keychain
    const tokenCredentials = await Keychain.getInternetCredentials(
      'accessToken',
    );
    if (!tokenCredentials) {
      return thunkAPI.rejectWithValue('No access token found');
    }

    // Call the auth/me endpoint
    const response = await axios.get<AuthResponse>(
      'https://podiumapp.site/server/auth/me',
      {
        headers: {Authorization: `Bearer ${tokenCredentials.password}`},
      },
    );
    // Flatten the nested structure
    const {user: actualUser, rolePermissions} = response.data.user;
    const primaryRoleName = actualUser.userRoles[0].role.name;
    // Call our helper function
    const generatedRoles = generateRoleArray(primaryRoleName);
    const activeRole = generatedRoles[0];
    // Optionally, update the user object (if you want to store it there too)
    actualUser.currentlyActiveAsRole = activeRole;

    return {
      user: actualUser,
      rolePermissions,
      availableRoles: generatedRoles,
      currentlyActiveAsRole: activeRole,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || 'Failed to fetch user details',
    );
  }
});

//!======================================== Login thunk =====================================
export const loginUser = createAsyncThunk<
  {accessToken: string; refreshToken: string; user: User; message: string},
  {email: string; password: string},
  {rejectValue: string}
>('auth/loginUser', async (loginData, thunkAPI) => {
  try {
    // The login endpoint returns a flat structure
    const response = await axios.post<{
      message: string;
      user: Partial<User>;
      accessToken: string;
      refreshToken: string;
    }>('https://podiumapp.site/server/auth/login', loginData);

    const {accessToken, refreshToken, user, message} = response.data;
    // Store tokens in Keychain
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
    return {accessToken, refreshToken, message, user: user as User};
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
  }
});

//!======================================== Signup thunk =====================================
export const signupUser = createAsyncThunk<
  string, // Returns a success message
  {name: string; email: string; password: string},
  {rejectValue: string}
>('auth/signupUser', async (signupData, thunkAPI) => {
  try {
    const response = await axios.post<{message: string}>(
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

//!======================================== Refresh Token thunk =====================================
export const refreshAccessToken = createAsyncThunk<
  {accessToken: string; refreshToken: string},
  void,
  {rejectValue: string}
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
    const {accessToken, refreshToken} = response.data;
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
    return {accessToken, refreshToken};
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || 'Token refresh failed',
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout: clear state and remove tokens from Keychain
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.rolePermissions = [];
      state.signupMessage = null;
      Keychain.resetInternetCredentials('accessToken');
      Keychain.resetInternetCredentials('refreshToken');
    },
    // Set user manually if needed
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // updateActiveRoleByIndex(state, action: PayloadAction<number>) {
    //   if (
    //     state.user &&
    //     state.user.userRoles &&
    //     state.user.userRoles.length > action.payload
    //   ) {
    //     state.currentlyActiveAsRole =
    //       state.user.userRoles[action.payload].role.name.toLowerCase();
    //     console.log('Updated active role to:', state.currentlyActiveAsRole);
    //   }
    // },

    updateActiveRoleByIndex(state, action: PayloadAction<number>) {
      if (
        state.availableRoles &&
        state.availableRoles.length > action.payload
      ) {
        state.currentlyActiveAsRole = state.availableRoles[action.payload];
        console.log('Updated active role to:', state.currentlyActiveAsRole);
      }
    },
  },
  extraReducers: builder => {
    builder
      //! Login cases
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
      //! Fetch User cases
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
      })
      //! Signup cases
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.signupMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        // Store the signup message; signup does not change user state.
        state.signupMessage = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      //! Token refresh cases (no change in authentication status)
      .addCase(refreshAccessToken.fulfilled, state => {
        state.loading = false;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Token refresh failed';
      });
  },
});

export const {logout, setUser, updateActiveRoleByIndex} = authSlice.actions;
export default authSlice.reducer;

// /src/api/apiClient.ts
import axios, {AxiosRequestConfig} from 'axios';
import * as Keychain from 'react-native-keychain';
// import store from '../store/store';
import {refreshAccessToken, logout} from '../redux/features/authSlice';
import store from '../redux/store';

const apiClient = axios.create({
  baseURL: 'https://podiumapp.site/server',
});

// Request interceptor to add access token
apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const tokenCredentials = await Keychain.getInternetCredentials('accessToken');
  if (tokenCredentials) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${tokenCredentials.password}`,
    };
  }
  return config;
});

// Response interceptor to handle 401 and refresh tokens
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const resultAction = await store.dispatch(refreshAccessToken());
        if (refreshAccessToken.fulfilled.match(resultAction)) {
          const {accessToken} = resultAction.payload;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } else {
          store.dispatch(logout());
        }
      } catch (err) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

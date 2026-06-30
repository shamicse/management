import axios from 'axios';
import { dispatchAuthSync, readStoredUser } from '../utils/authSync';
import { refreshAccessToken } from '../utils/sessionRefresh';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

const AUTH_SKIP_REFRESH = ['/auth/refresh', '/auth/login', '/auth/logout'];

const shouldSkipRefresh = (url = '') =>
  AUTH_SKIP_REFRESH.some((path) => url.includes(path));

api.interceptors.request.use((config) => {
  const user = readStoredUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

let isRefreshing = false;
let pending = [];

const onRefreshed = (token) => {
  pending.forEach((cb) => cb(token));
  pending = [];
};

const onRefreshFailed = (error) => {
  pending.forEach((cb) => cb(null, error));
  pending = [];
};

const attemptTokenRefresh = async () => {
  try {
    return await refreshAccessToken();
  } catch (firstError) {
    if (firstError.response?.status === 401) {
      return refreshAccessToken();
    }
    throw firstError;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original?._retry ||
      shouldSkipRefresh(original?.url)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pending.push((token, refreshError) => {
          if (refreshError || !token) {
            reject(refreshError || error);
            return;
          }
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const token = await attemptTokenRefresh();
      onRefreshed(token);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      localStorage.removeItem('user');
      dispatchAuthSync();
      onRefreshFailed(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

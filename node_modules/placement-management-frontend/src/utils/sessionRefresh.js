import api from '../services/api';
import { dispatchAuthSync, readStoredUser } from './authSync';

const REFRESH_BEFORE_MS = 2 * 60 * 1000;
const FOCUS_REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

export const decodeTokenExp = (token) => {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const refreshAccessToken = async () => {
  const { data } = await api.post('/auth/refresh');
  const user = readStoredUser();
  if (user) {
    user.token = data.token;
    user.role = data.role || user.role;
    localStorage.setItem('user', JSON.stringify(user));
    dispatchAuthSync();
  }
  return data.token;
};

export const setupSessionRefresh = ({ onLogout } = {}) => {
  let timer = null;

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const schedule = () => {
    clearTimer();
    const user = readStoredUser();
    if (!user?.token) return;

    const exp = decodeTokenExp(user.token);
    if (!exp) return;

    const delay = Math.max(exp - Date.now() - REFRESH_BEFORE_MS, 15_000);

    timer = setTimeout(async () => {
      try {
        await refreshAccessToken();
        schedule();
      } catch {
        onLogout?.();
      }
    }, delay);
  };

  const onFocus = async () => {
    const user = readStoredUser();
    if (!user?.token) return;

    const exp = decodeTokenExp(user.token);
    if (!exp) return;

    if (exp - Date.now() < FOCUS_REFRESH_THRESHOLD_MS) {
      try {
        await refreshAccessToken();
        schedule();
      } catch {
        // Next API call will attempt refresh via interceptor
      }
    }
  };

  window.addEventListener('focus', onFocus);
  schedule();

  return () => {
    clearTimer();
    window.removeEventListener('focus', onFocus);
  };
};

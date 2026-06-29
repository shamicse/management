export const readStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const dispatchAuthSync = () => {
  window.dispatchEvent(new Event('auth-sync'));
};

export const getApiErrorMessage = (err, fallback = 'Something went wrong') => {
  if (!err?.response) {
    return 'Cannot reach server. Make sure the backend is running on port 5000.';
  }

  const data = err.response.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join(' ');
  }

  const msg = data?.message || fallback;
  if (err.response.status === 403 && msg.toLowerCase().includes('access denied')) {
    return 'Session mismatch (wrong role or expired login). Please log out and sign in again with the correct account.';
  }

  return msg;
};

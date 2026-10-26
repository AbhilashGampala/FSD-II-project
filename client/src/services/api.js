const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Common request wrapper with JSON headers and cookie credentials
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Crucial for httpOnly JWT cookie
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const api = {
  // Auth
  getConfig: () => request('/auth/config', { method: 'GET' }),
  requestOtp: (email) => request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  signupProfile: (profileData) => request('/auth/signup-profile', { method: 'POST', body: JSON.stringify(profileData) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // System
  getHealth: () => request('/health', { method: 'GET' })
};

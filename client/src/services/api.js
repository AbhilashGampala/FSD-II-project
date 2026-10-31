const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Common request wrapper with JSON headers, Authorization token, and cookie credentials
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('vit_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Crucial for httpOnly JWT cookie
  };

  try {
    const res = await fetch(url, config);
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      data = { message: res.statusText || 'Unexpected server response' };
    }

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    // Persist token to localStorage if returned
    if (data && data.token) {
      localStorage.setItem('vit_auth_token', data.token);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    throw err;
  }
};

export const api = {
  // Auth
  login: (identifier, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  }),
  getConfig: () => request('/auth/config', { method: 'GET' }),
  requestOtp: (email) => request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  signupProfile: (profileData) => request('/auth/signup-profile', { method: 'POST', body: JSON.stringify(profileData) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('vit_auth_token');
    }
  },

  // System Health
  getHealth: () => request('/health', { method: 'GET' }),

  // Dashboard
  getOfficerDashboard: () => request('/dashboard/officer', { method: 'GET' }),
  getStudentDashboard: () => request('/dashboard/student', { method: 'GET' }),

  // Profile
  getProfile: () => request('/profile', { method: 'GET' }),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Companies
  getCompanies: (search = '') => request(`/companies${search ? `?search=${encodeURIComponent(search)}` : ''}`, { method: 'GET' }),
  getCompany: (id) => request(`/companies/${id}`, { method: 'GET' }),
  createCompany: (data) => request('/companies', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id, data) => request(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompany: (id) => request(`/companies/${id}`, { method: 'DELETE' }),

  // Drives
  getDrives: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/drives${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getDrive: (id) => request(`/drives/${id}`, { method: 'GET' }),
  createDrive: (data) => request('/drives', { method: 'POST', body: JSON.stringify(data) }),
  updateDrive: (id, data) => request(`/drives/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateDriveStatus: (id, status) => request(`/drives/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  duplicateDrive: (id) => request(`/drives/${id}/duplicate`, { method: 'POST' }),

  // Applications
  getApplicationsByDrive: (driveId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/applications/drive/${driveId}${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  updateApplicationStatus: (id, status, note = '') => request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  bulkShortlist: (applicationIds, note = '') => request('/applications/bulk-shortlist', { method: 'POST', body: JSON.stringify({ applicationIds, note }) }),
  applyForDrive: (driveId) => request('/applications', { method: 'POST', body: JSON.stringify({ driveId }) }),
  getMyApplications: () => request('/applications/mine', { method: 'GET' }),
  withdrawApplication: (id) => request(`/applications/${id}/withdraw`, { method: 'PATCH' }),

  // Interviews
  getInterviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/interviews${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  createInterview: (data) => request('/interviews', { method: 'POST', body: JSON.stringify(data) }),
  updateInterview: (id, data) => request(`/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateInterviewStatus: (id, status) => request(`/interviews/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getMyInterviews: () => request('/interviews/mine', { method: 'GET' }),

  // Offers
  getOffers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/offers${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  createOffer: (data) => request('/offers', { method: 'POST', body: JSON.stringify(data) }),
  getMyOffers: () => request('/offers/mine', { method: 'GET' }),
  respondToOffer: (id, action) => request(`/offers/${id}/respond`, { method: 'PATCH', body: JSON.stringify({ action }) }),

  // Placement Stats
  getStats: () => request('/stats', { method: 'GET' }),
  createStat: (data) => request('/stats', { method: 'POST', body: JSON.stringify(data) }),
  updateStat: (id, data) => request(`/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Admin Portal
  getAdminDashboard: () => request('/dashboard/admin', { method: 'GET' }),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  toggleUserStatus: (id, isActive) => request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  createOfficerAccount: (data) => request('/admin/users/officer', { method: 'POST', body: JSON.stringify(data) }),
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/audit${query ? `?${query}` : ''}`, { method: 'GET' });
  }
};

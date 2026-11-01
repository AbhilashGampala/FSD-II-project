import { demoService } from './demoService.js';

/**
 * Determine API Base URL dynamically
 * Prevents remote production deployments from trying to call localhost
 */
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost && envUrl && envUrl.includes('localhost')) {
      return '/api';
    }
  }
  return envUrl || '/api';
};

/**
 * Check if the active browser session is in Demo Mode
 */
export const isDemoSession = () => {
  try {
    return Boolean(localStorage.getItem('vit_demo_user'));
  } catch (e) {
    return false;
  }
};

/**
 * Common request wrapper with JSON headers, Authorization token, and cookie credentials
 */
const request = async (endpoint, options = {}) => {
  const url = `${getApiBase()}${endpoint}`;
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
      const netErr = new Error('Unable to connect to server. Please ensure the backend is running.');
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw err;
  }
};

export const api = {
  // --- System Health & Connectivity ---
  checkBackendHealth: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${getApiBase()}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch (err) {
      return false;
    }
  },
  getHealth: () => request('/health', { method: 'GET' }),

  // --- Auth Endpoints ---
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
      if (!isDemoSession()) {
        await request('/auth/logout', { method: 'POST' });
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('vit_auth_token');
      localStorage.removeItem('vit_demo_user');
    }
  },

  // --- Dashboards ---
  getOfficerDashboard: () => {
    if (isDemoSession()) return demoService.getOfficerDashboard();
    return request('/dashboard/officer', { method: 'GET' });
  },
  getStudentDashboard: () => {
    if (isDemoSession()) return demoService.getStudentDashboard();
    return request('/dashboard/student', { method: 'GET' });
  },
  getAdminDashboard: () => {
    if (isDemoSession()) return demoService.getAdminDashboard();
    return request('/dashboard/admin', { method: 'GET' });
  },

  // --- Profiles ---
  getProfile: () => {
    if (isDemoSession()) return demoService.getProfile();
    return request('/profile', { method: 'GET' });
  },
  updateProfile: (data) => {
    if (isDemoSession()) return demoService.updateProfile(data);
    return request('/profile', { method: 'PUT', body: JSON.stringify(data) });
  },

  // --- Companies ---
  getCompanies: (search = '') => {
    if (isDemoSession()) return demoService.getCompanies(search);
    return request(`/companies${search ? `?search=${encodeURIComponent(search)}` : ''}`, { method: 'GET' });
  },
  getCompany: (id) => {
    if (isDemoSession()) return demoService.getCompany(id);
    return request(`/companies/${id}`, { method: 'GET' });
  },
  createCompany: (data) => {
    if (isDemoSession()) return demoService.createCompany(data);
    return request('/companies', { method: 'POST', body: JSON.stringify(data) });
  },
  updateCompany: (id, data) => {
    if (isDemoSession()) return demoService.updateCompany(id, data);
    return request(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteCompany: (id) => {
    if (isDemoSession()) return demoService.deleteCompany(id);
    return request(`/companies/${id}`, { method: 'DELETE' });
  },

  // --- Drives ---
  getDrives: (params = {}) => {
    if (isDemoSession()) return demoService.getDrives(params);
    const query = new URLSearchParams(params).toString();
    return request(`/drives${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getDrive: (id) => {
    if (isDemoSession()) return demoService.getDrive(id);
    return request(`/drives/${id}`, { method: 'GET' });
  },
  createDrive: (data) => {
    if (isDemoSession()) return demoService.createDrive(data);
    return request('/drives', { method: 'POST', body: JSON.stringify(data) });
  },
  updateDrive: (id, data) => {
    if (isDemoSession()) return demoService.updateDrive(id, data);
    return request(`/drives/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  updateDriveStatus: (id, status) => {
    if (isDemoSession()) return demoService.updateDriveStatus(id, status);
    return request(`/drives/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  duplicateDrive: (id) => {
    if (isDemoSession()) return demoService.duplicateDrive(id);
    return request(`/drives/${id}/duplicate`, { method: 'POST' });
  },

  // --- Applications ---
  getApplicationsByDrive: (driveId, params = {}) => {
    if (isDemoSession()) return demoService.getApplicationsByDrive(driveId, params);
    const query = new URLSearchParams(params).toString();
    return request(`/applications/drive/${driveId}${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  updateApplicationStatus: (id, status, note = '') => {
    if (isDemoSession()) return demoService.updateApplicationStatus(id, status, note);
    return request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) });
  },
  bulkShortlist: (applicationIds, note = '') => {
    if (isDemoSession()) return demoService.bulkShortlist(applicationIds, note);
    return request('/applications/bulk-shortlist', { method: 'POST', body: JSON.stringify({ applicationIds, note }) });
  },
  applyForDrive: (driveId) => {
    if (isDemoSession()) return demoService.applyForDrive(driveId);
    return request('/applications', { method: 'POST', body: JSON.stringify({ driveId }) });
  },
  getMyApplications: () => {
    if (isDemoSession()) return demoService.getMyApplications();
    return request('/applications/mine', { method: 'GET' });
  },
  withdrawApplication: (id) => {
    if (isDemoSession()) return demoService.withdrawApplication(id);
    return request(`/applications/${id}/withdraw`, { method: 'PATCH' });
  },

  // --- Interviews ---
  getInterviews: (params = {}) => {
    if (isDemoSession()) return demoService.getInterviews(params);
    const query = new URLSearchParams(params).toString();
    return request(`/interviews${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  createInterview: (data) => {
    if (isDemoSession()) return demoService.createInterview(data);
    return request('/interviews', { method: 'POST', body: JSON.stringify(data) });
  },
  updateInterview: (id, data) => {
    if (isDemoSession()) return demoService.updateInterview(id, data);
    return request(`/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  updateInterviewStatus: (id, status) => {
    if (isDemoSession()) return demoService.updateInterviewStatus(id, status);
    return request(`/interviews/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  getMyInterviews: () => {
    if (isDemoSession()) return demoService.getMyInterviews();
    return request('/interviews/mine', { method: 'GET' });
  },

  // --- Offers ---
  getOffers: (params = {}) => {
    if (isDemoSession()) return demoService.getOffers(params);
    const query = new URLSearchParams(params).toString();
    return request(`/offers${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  createOffer: (data) => {
    if (isDemoSession()) return demoService.createOffer(data);
    return request('/offers', { method: 'POST', body: JSON.stringify(data) });
  },
  getMyOffers: () => {
    if (isDemoSession()) return demoService.getMyOffers();
    return request('/offers/mine', { method: 'GET' });
  },
  respondToOffer: (id, action) => {
    if (isDemoSession()) return demoService.respondToOffer(id, action);
    return request(`/offers/${id}/respond`, { method: 'PATCH', body: JSON.stringify({ action }) });
  },

  // --- Placement Stats ---
  getStats: () => {
    if (isDemoSession()) return demoService.getStats();
    return request('/stats', { method: 'GET' });
  },
  createStat: (data) => {
    if (isDemoSession()) return demoService.createStat(data);
    return request('/stats', { method: 'POST', body: JSON.stringify(data) });
  },
  updateStat: (id, data) => {
    if (isDemoSession()) return demoService.updateStat(id, data);
    return request(`/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  // --- Admin Portal ---
  getUsers: (params = {}) => {
    if (isDemoSession()) return demoService.getUsers(params);
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  updateUserRole: (id, role) => {
    if (isDemoSession()) return demoService.updateUserRole(id, role);
    return request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
  },
  toggleUserStatus: (id, isActive) => {
    if (isDemoSession()) return demoService.toggleUserStatus(id, isActive);
    return request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
  },
  createOfficerAccount: (data) => {
    if (isDemoSession()) return demoService.createOfficerAccount(data);
    return request('/admin/users/officer', { method: 'POST', body: JSON.stringify(data) });
  },
  getAuditLogs: (params = {}) => {
    if (isDemoSession()) return demoService.getAuditLogs(params);
    const query = new URLSearchParams(params).toString();
    return request(`/admin/audit${query ? `?${query}` : ''}`, { method: 'GET' });
  }
};

const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn(`API request to ${url} failed or offline:`, err);
    return null;
  }
}

export const api = {
  // Auth
  login: (email, pass) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, pass })
    }),

  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    }),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    }),

  // Schemes
  getSchemes: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/schemes${qs ? `?${qs}` : ""}`);
  },

  createScheme: (schemeData) =>
    request("/schemes", {
      method: "POST",
      body: JSON.stringify(schemeData)
    }),

  updateScheme: (id, schemeData) =>
    request(`/schemes/${id}`, {
      method: "PUT",
      body: JSON.stringify(schemeData)
    }),

  deleteScheme: (id) =>
    request(`/schemes/${id}`, {
      method: "DELETE"
    }),

  // Applications
  getApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/applications${qs ? `?${qs}` : ""}`);
  },

  submitApplication: (appData) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(appData)
    }),

  updateApplicationStatus: (id, status) =>
    request(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  // User & Data
  updateProfile: (id, profileData) =>
    request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(profileData)
    }),

  resetSeedData: () =>
    request("/reset-seed", {
      method: "POST"
    }),

  getAllData: () => request("/all-data")
};

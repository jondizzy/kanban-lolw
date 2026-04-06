import axios from "axios";

// Shared HTTP client for the Kanban app.
// Requests stay relative to the current host so the same build can work
// across environments without changing each call site.
const api = axios.create({
  baseURL: "/",
  // baseURL: "http://localhost:8080",
  // Keep cookie-based sessions available for `auth/me` and card requests.
  withCredentials: true,
});

export default api;

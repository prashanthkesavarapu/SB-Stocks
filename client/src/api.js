import axios from "axios";

// Vite proxies `/api` to Express during local development. Set VITE_API_URL to
// the deployed backend URL when the frontend and API are hosted separately.
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });
export const authHeaders = token => ({ headers: { Authorization: `Bearer ${token}` } });

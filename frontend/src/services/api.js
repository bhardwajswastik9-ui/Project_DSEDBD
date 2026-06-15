import axios from "axios";

export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: GATEWAY_URL,
});

export default API;
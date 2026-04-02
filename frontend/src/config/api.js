// Central API configuration - uses VITE_API_URL in production, localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;

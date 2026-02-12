import axios from 'axios';

const getBaseUrl = () => {
    return localStorage.getItem('api_url') || 'http://127.0.0.1:3001';
};

const api = axios.create({
    baseURL: getBaseUrl()
});

// Interceptor to handle dynamic base URL and authentication
api.interceptors.request.use((config) => {
    const baseUrl = getBaseUrl();
    // Ensure the URL starts with /api if it doesn't have it
    if (config.url && !config.url.startsWith('http')) {
        config.baseURL = baseUrl;
    }

    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

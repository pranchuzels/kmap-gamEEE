// frontend/src/config/api.js

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    const hostname = window.location.hostname;

    if (hostname.includes('vercel.app')) {
        return "https://kmap-gameee-backend.vercel.app";
        
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return "http://localhost:5173";
        
    } else {
        return "/kmapgameee/api";
    }
};

const RAW_API_BASE_URL = getBaseUrl();

/**
 * Appends the endpoint to the dynamically detected base API URL.
 */
export const apiUrl = (endpoint) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${RAW_API_BASE_URL}${cleanEndpoint}`;
};
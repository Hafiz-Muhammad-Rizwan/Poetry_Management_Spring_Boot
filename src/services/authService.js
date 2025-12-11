// Auth utility functions
export const authService = {
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('jwtToken');
        return !!token;
    },

    // Get JWT token
    getToken: () => {
        return localStorage.getItem('jwtToken');
    },

    // Get username
    getUsername: () => {
        return localStorage.getItem('username');
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
    },

    // Add token to request headers
    getAuthHeader: () => {
        const token = authService.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// Fetch with auth token
export const authFetch = async (url, options = {}) => {
    const token = authService.getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};

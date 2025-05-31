import axios from 'axios';

export function setupAxiosInterceptors() {
    axios.defaults.baseURL = '/api/v1/users';
    axios.defaults.withCredentials = true;

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
            // Attempt to refresh the token
            const res = await axios.post('/refresh-token'); // Should be HTTP-only cookie based
            
            // Retry the original request
            return axios(originalRequest);
            } catch (refreshError) {
            window.location.href = '/';
            return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
        }
    );
}

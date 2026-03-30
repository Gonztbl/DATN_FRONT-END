import axios from 'axios';

// Base URL cho API
const API_BASE_URL = 'http://localhost:8080';

// Tạo axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // Note: Do NOT set a default Content-Type here. 
    // Axios will automatically set it based on the data type (JSON vs FormData).
    timeout: 30000, 
});

// Request interceptor - Tự động thêm JWT token vào headers
apiClient.interceptors.request.use(
    (config) => {
        console.log('🚀 API Request:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            data: config.data,
        });

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Token attached');
        }

        // Fix: Nếu data là FormData, đảm bảo không có Content-Type cứng (để trình duyệt tự tạo boundary)
        if (config.data instanceof FormData) {
            if (config.headers) {
                delete config.headers['Content-Type'];
                if (config.headers.delete) config.headers.delete('Content-Type');
            }
            console.log('📦 [apiClient] FormData detected - Allowing browser to set boundary');
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi global
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error Full:', {
            url: error.config?.url,
            message: error.message,
            responseData: error.response?.data,
            responseText: error.response?.request?.responseText,
            status: error.response?.status,
            headers: error.config?.headers,
        });

        // Nếu token hết hạn hoặc không hợp lệ (401)
        if (error.response && error.response.status === 401) {
            console.warn('⚠️ Unauthorized - Logging out');
            // Xóa token và redirect về login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Check CORS error
        if (!error.response) {
            console.error('🚫 Network Error - Có thể là CORS issue hoặc backend không chạy');
        }

        return Promise.reject(error);
    }
);

export default apiClient;

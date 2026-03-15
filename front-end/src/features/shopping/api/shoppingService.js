import apiClient from "../../../api/apiClient";

const shoppingService = {
    // 1. API lấy danh sách danh mục món ăn
    getCategories: async () => {
        try {
            const response = await apiClient.get('/api/categories');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            throw error;
        }
    },

    // 2. & 5. API lấy danh sách sản phẩm (có thể lọc theo category_id hoặc search)
    getProducts: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/products', { params });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            throw error;
        }
    },

    // 3. API lấy chi tiết một sản phẩm
    getProductDetails: async (id) => {
        try {
            const response = await apiClient.get(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết sản phẩm ${id}:`, error);
            throw error;
        }
    },

    // 4. API lấy danh sách đánh giá của sản phẩm
    getProductReviews: async (id, params = {}) => {
        try {
            const response = await apiClient.get(`/api/products/${id}/reviews`, { params });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy đánh giá sản phẩm ${id}:`, error);
            throw error;
        }
    },

    // 6. API đặt hàng (checkout)
    createOrder: async (orderData) => {
        try {
            const response = await apiClient.post('/api/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            throw error;
        }
    }
};

export default shoppingService;

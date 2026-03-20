import apiClient from '../../../api/apiClient';

const merchantProductService = {
    /**
     * Get restaurant's products
     * params: { page, size, status }
     */
    getProducts: (params) => {
        return apiClient.get('/api/restaurant-owner/products', { params });
    },

    /**
     * Create a new product
     * data: { name, description, price, imageBase64, categoryId, status }
     */
    createProduct: (data) => {
        return apiClient.post('/api/restaurant-owner/products', data);
    },

    /**
     * Update an existing product
     * data: { name, description, price, imageBase64, status }
     */
    updateProduct: (id, data) => {
        return apiClient.put(`/api/restaurant-owner/products/${id}`, data);
    },

    /**
     * Delete a product
     */
    deleteProduct: (id) => {
        return apiClient.delete(`/api/restaurant-owner/products/${id}`);
    },

    /**
     * Update product status (available/unavailable)
     */
    updateProductStatus: (id, status) => {
        return apiClient.put(`/api/restaurant-owner/products/${id}/status`, { status });
    }
};

export default merchantProductService;

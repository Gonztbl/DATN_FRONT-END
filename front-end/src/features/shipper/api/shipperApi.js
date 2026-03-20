import apiClient from '../../../api/apiClient';

const shipperService = {
    /**
     * Get list of orders for shipper
     * @param {Object} params - Query parameters (page, limit, status, assigned, sortBy, sortDir)
     */
    getOrders: (params) => {
        return apiClient.get('/api/shipper/orders', { params });
    },

    /**
     * Get detail of a specific order
     * @param {string|number} id - Order ID
     */
    getOrderDetail: (id) => {
        return apiClient.get(`/api/shipper/orders/${id}`);
    },

    /**
     * Accept a pending order
     * @param {string|number} id - Order ID
     */
    acceptOrder: (id) => {
        return apiClient.put(`/api/shipper/orders/${id}/accept`);
    },

    /**
     * Mark order as picked up
     * @param {string|number} id - Order ID
     */
    pickedUpOrder: (id) => {
        return apiClient.put(`/api/shipper/orders/${id}/picked-up`);
    },

    /**
     * Mark order as delivered
     * @param {string|number} id - Order ID
     * @param {Object} payload - { photoBase64 }
     */
    deliveredOrder: (id, payload = {}) => {
        return apiClient.put(`/api/shipper/orders/${id}/delivered`, payload);
    },

    /**
     * Mark order as failed
     * @param {string|number} id - Order ID
     * @param {Object} payload - { reason, photoBase64 }
     */
    failOrder: (id, payload) => {
        return apiClient.put(`/api/shipper/orders/${id}/failed`, payload);
    },

    /**
     * Get shipper's own profile (using the generic /api/user/profile or /api/me)
     * For now we use the available profile endpoint.
     */
    getProfile: () => {
        return apiClient.get('/api/user/profile');
    },

    /**
     * Update shipper's profile
     */
    updateProfile: (data) => {
        return apiClient.put('/api/user/profile', data);
    }
};

export default shipperService;

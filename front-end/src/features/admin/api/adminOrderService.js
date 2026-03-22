import apiClient from '../../../api/apiClient';

const adminOrderService = {
    /**
     * Get list of all orders with advanced filters
     * @param {Object} params - Query parameters (status, userId, restaurantId, fromDate, toDate, search, sortBy, sortDir, page, size)
     */
    getAllOrders: (params) => {
        return apiClient.get('/api/admin/orders', { params });
    },

    /**
     * Get detailed information for a specific order
     * @param {string|number} id - Order ID
     */
    getOrderDetail: (id) => {
        return apiClient.get(`/api/admin/orders/${id}`);
    },

    /**
     * Update order status manually
     * @param {string|number} id - Order ID
     * @param {string} status - New status (CONFIRMED, etc.)
     * @param {string} note - Optional note
     */
    updateOrderStatus: (id, status, note = '') => {
        return apiClient.put(`/api/admin/orders/${id}/status`, { status, note });
    },

    /**
     * Cancel an order (Admin level)
     * @param {string|number} id - Order ID
     * @param {string} reason - Cancellation reason
     */
    cancelOrder: (id, reason) => {
        return apiClient.put(`/api/admin/orders/${id}/cancel`, { reason });
    },

    /**
     * Get detailed information for a specific shipper
     */
    getShipperDetail: (id) => {
        return apiClient.get(`/api/admin/shippers/${id}`);
    },

    /**
     * Get list of all shippers with pagination/filtering
     */
    getShippers: (params) => {
        return apiClient.get('/api/admin/shippers', { params });
    },

    /**
     * Get restaurant owners (with pagination/search)
     */
    getRestaurantOwners: (params) => {
        return apiClient.get('/api/admin/restaurant-owners', { params });
    },

    /**
     * Get detailed product information
     */
    getProductById: (id) => {
        return apiClient.get(`/api/products/${id}`);
    },
    
    /**
     * Delete an order (Admin/Support only)
     * @param {string|number} id - Order ID
     */
    deleteOrder: (id) => {
        return apiClient.delete(`/api/admin/orders/${id}`);
    }
};


export default adminOrderService;

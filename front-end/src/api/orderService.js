import apiClient from './apiClient';

/**
 * Order Service to handle order-related API calls.
 */
const orderService = {
    /**
     * Get orders for the current user with pagination and filtering.
     * @param {Object} params - Query parameters.
     * @param {number} params.page - Page number (starts from 0).
     * @param {number} params.size - Number of items per page.
     * @param {string} params.status - Filter by status (PENDING, CONFIRMED, PREPARING, DELIVERING, COMPLETED, CANCELLED).
     * @param {string} params.sort - Sort order (e.g., 'createdAt,desc').
     * @returns {Promise} - Axios promise.
     */
    getOrders: (params = {}) => {
        const defaultParams = {
            page: 0,
            size: 10,
            sort: 'createdAt,desc',
            ...params
        };

        // Remove status if it's 'ALL' or empty
        if (defaultParams.status === 'ALL' || !defaultParams.status) {
            delete defaultParams.status;
        }

        return apiClient.get('/api/orders', { params: defaultParams });
    },

    /**
     * Get a specific order by ID.
     * @param {number|string} orderId - The order ID.
     * @returns {Promise} - Axios promise.
     */
    getOrderById: (orderId) => {
        return apiClient.get(`/api/orders/${orderId}`);
    },

    /**
     * Cancel an order.
     * @param {number|string} orderId - The order ID.
     * @param {Object} data - Optional reason for cancellation.
     * @returns {Promise} - Axios promise.
     */
    cancelOrder: (orderId, data = {}) => {
        return apiClient.put(`/api/orders/${orderId}/cancel`, data);
    },

    /**
     * Reorder an existing order.
     * @param {number|string} orderId - The order ID.
     * @param {Object} data - Optional new delivery details.
     * @returns {Promise} - Axios promise.
     */
    reorder: (orderId, data = {}) => {
        return apiClient.post(`/api/orders/${orderId}/reorder`, data);
    },

    /**
     * Get real-time tracking for an order.
     * @param {number|string} orderId - The order ID.
     * @returns {Promise} - Axios promise.
     */
    getTracking: (orderId) => {
        return apiClient.get(`/api/orders/tracking/${orderId}`);
    },

    /**
     * Get product details by ID.
     */
    getProductById: (productId) => {
        return apiClient.get(`/api/products/${productId}`);
    },

    /**
     * Get shipper details (Admin scope, but needed for specific cases).
     */
    getShipperAdmin: (shipperId) => {
        return apiClient.get(`/api/admin/shippers/${shipperId}`);
    },

    /**
     * Get restaurant owners (Admin scope).
     */
    getRestaurantOwners: (params = {}) => {
        return apiClient.get('/api/admin/restaurant-owners', { params });
    }
};

export default orderService;

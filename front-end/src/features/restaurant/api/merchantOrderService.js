import apiClient from '../../../api/apiClient';

const merchantOrderService = {
    /**
     * Get orders for restaurant owner with optional filters and pagination
     * params: { page, size, status }
     */
    getOrders: (params) => {
        return apiClient.get('/api/restaurant-owner/orders', { params });
    },

    /**
     * Get details of a single order
     */
    getOrderDetail: (id) => {
        return apiClient.get(`/api/restaurant-owner/orders/${id}`);
    },

    /**
     * Confirm an order (transition from PENDING to CONFIRMED)
     */
    confirmOrder: (id) => {
        return apiClient.put(`/api/restaurant-owner/orders/${id}/confirm`);
    },

    /**
     * Mark an order as ready for pickup (transition from CONFIRMED/PREPARING to READY_FOR_PICKUP)
     */
    markOrderReady: (id) => {
        return apiClient.put(`/api/restaurant-owner/orders/${id}/ready`);
    },

    /**
     * Reject/Cancel an order
     * payload: { reason: string }
     */
    rejectOrder: (id, payload) => {
        return apiClient.put(`/api/restaurant-owner/orders/${id}/reject`, payload);
    }
};

export default merchantOrderService;

import apiClient from '../../../api/apiClient';

const merchantDashboardService = {
    /**
     * Update the operational status of the restaurant
     * data: { status: "OPEN" | "CLOSED" | "BUSY" }
     */
    updateRestaurantStatus: (data) => {
        return apiClient.put('/api/restaurant-owner/restaurant/status', data);
    },

    /**
     * Get the current owner's restaurant details
     */
    getMyRestaurant: () => {
        return apiClient.get('/api/restaurant-owner/my-restaurant');
    },

    /**
     * Get revenue statistics (if available)
     */
    getRevenue: (params) => {
        return apiClient.get('/api/admin/statistics/revenue', { params });
    }
};

export default merchantDashboardService;

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
     * Update restaurant details including schedule
     */
    updateRestaurantInfo: (data) => {
        return apiClient.put('/api/restaurant-owner/restaurant/info', data);
    },


    /**
     * Get the current owner's restaurant details
     */
    getMyRestaurant: () => {
        return apiClient.get('/api/restaurant-owner/my-restaurant');
    },

    /**
     * Get restaurant owner's wallet balance
     */
    getWalletBalance: () => {
        return apiClient.get('/api/restaurant-owner/wallet/balance');
    }
};

export default merchantDashboardService;

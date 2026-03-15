import apiClient from "../../../api/apiClient";

const restaurantService = {
    getRestaurants: async (params) => {
        try {
            const response = await apiClient.get('/api/admin/restaurants', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getRestaurantDetail: async (id) => {
        try {
            const response = await apiClient.get(`/api/admin/restaurants/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createRestaurant: async (data) => {
        try {
            const response = await apiClient.post('/api/admin/restaurants', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateRestaurant: async (id, data) => {
        try {
            const response = await apiClient.put(`/api/admin/restaurants/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteRestaurant: async (id) => {
        try {
            const response = await apiClient.delete(`/api/admin/restaurants/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkRestaurantName: async (name, excludeId = null) => {
        try {
            const params = { name };
            if (excludeId) params.exclude_id = excludeId;
            const response = await apiClient.get('/api/admin/restaurants/check-name', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    exportRestaurants: async (params) => {
        try {
            const response = await apiClient.get('/api/admin/restaurants/export', {
                params,
                responseType: 'blob', // Important for file download
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default restaurantService;

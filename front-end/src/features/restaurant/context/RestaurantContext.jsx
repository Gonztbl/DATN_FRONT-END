import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import merchantDashboardService from '../api/merchantDashboardService';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [restaurantData, setRestaurantData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyRestaurant = useCallback(async (isInitial = false) => {
        if (!isAuthenticated || !user?.roles?.includes('RESTAURANT_OWNER')) {
            setRestaurantData(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await merchantDashboardService.getMyRestaurant();
            setRestaurantData(response.data);
            return response.data;
        } catch (err) {
            console.error('Error fetching restaurant data:', err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message || 'Could not fetch restaurant data';
            
            setError({
                status: status,
                message: message,
                isNotFound: status === 400 || status === 404
            });
            setRestaurantData(null);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    // Initial fetch when authenticated as RESTAURANT_OWNER
    useEffect(() => {
        if (isAuthenticated && user?.roles?.includes('RESTAURANT_OWNER') && !restaurantData && !loading && !error) {
            fetchMyRestaurant(true);
        } else if (!isAuthenticated) {
            setRestaurantData(null);
            setError(null);
        }
    }, [isAuthenticated, user, restaurantData, loading, error, fetchMyRestaurant]);

    const value = React.useMemo(() => ({
        restaurantData,
        loading,
        error,
        fetchMyRestaurant,
        isRestaurantLoaded: !!restaurantData
    }), [restaurantData, loading, error, fetchMyRestaurant]);

    return (
        <RestaurantContext.Provider value={value}>
            {children}
        </RestaurantContext.Provider>
    );
};

export const useRestaurant = () => {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
};

export default RestaurantContext;

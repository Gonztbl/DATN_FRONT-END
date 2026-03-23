import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import shipperService from '../../features/shipper/api/shipperApi';

const HeaderShipper = ({ title, showBack = false, onBack }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { showSuccess } = useNotification();
    const [newOrdersCount, setNewOrdersCount] = useState(0);

    useEffect(() => {
        const checkNewOrders = async () => {
            try {
                // Get orders that are READY_FOR_PICKUP and not yet assigned
                const res = await shipperService.getOrders({ 
                    status: 'READY_FOR_PICKUP', 
                    assigned: false 
                });
                // Extract total from pagination field as requested
                // res.data might be { data: [], pagination: { total: 5, ... } }
                const data = res.data;
                if (data && data.pagination) {
                    setNewOrdersCount(data.pagination.total || 0);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra đơn mới", error);
            }
        };

        checkNewOrders(); // Initial check
        const interval = setInterval(checkNewOrders, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        showSuccess("Đã đăng xuất thành công", "Thành công");
        navigate('/login');
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button 
                        onClick={handleBack}
                        className="flex items-center justify-center rounded-full bg-primary/20 p-2 text-primary hover:bg-primary/30 transition-colors mr-2"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                )}
                {!showBack && (
                    <div className="text-primary">
                        <span className="material-symbols-outlined text-3xl">delivery_dining</span>
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{title || 'Đơn hàng của tôi'}</h1>
                    {showBack && <p className="text-xs text-slate-500">Chi tiết đơn hàng</p>}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate('/shipper/orders')}
                    className="relative flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                    title={newOrdersCount > 0 ? `Có ${newOrdersCount} đơn hàng mới đang chờ!` : "Thông báo"}
                >
                    <span className="material-symbols-outlined">notifications</span>
                    {newOrdersCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                            {newOrdersCount > 9 ? '9+' : newOrdersCount}
                        </span>
                    )}
                </button>
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>

                <div className="flex flex-col items-end pr-2 pl-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {user?.fullName || user?.username || 'Shipper'}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mt-0.5">
                        Sẵn sàng
                    </span>
                </div>
            </div>
        </header>
    );
};

export default HeaderShipper;

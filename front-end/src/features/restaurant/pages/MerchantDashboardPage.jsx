import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';
import merchantDashboardService from '../api/merchantDashboardService';
import merchantOrderService from '../api/merchantOrderService';
import { useRestaurant } from '../context/RestaurantContext';
import Swal from 'sweetalert2';

const MerchantDashboardPage = () => {
    const navigate = useNavigate();
    const { restaurantData, loading: restaurantLoading, error: contextError } = useRestaurant();
    
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);
    const [restaurantStatus, setRestaurantStatus] = useState("OPEN");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    
    // Stats variables
    const [dashboardStats, setDashboardStats] = useState({
        newOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        preparingOrders: 0,
        walletBalance: 0,
        walletTrend: 0,
        revenueTrend: 0,
        ordersTrend: 0
    });

    const [chartData, setChartData] = useState([
        { day: 'T2', height: '0%' },
        { day: 'T3', height: '0%' },
        { day: 'T4', height: '0%' },
        { day: 'T5', height: '0%' },
        { day: 'T6', height: '0%' },
        { day: 'T7', height: '0%' },
        { day: 'CN', height: '0%' }
    ]);


    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch recent orders (page 1 according to new spec)
            const ordersRes = await merchantOrderService.getOrders({ page: 1, limit: 50 });
            let ordersList = [];
            
            // Match the new { data: [...], pagination: {...} } structure
            if (ordersRes.data) {
                ordersList = ordersRes.data.data || ordersRes.data.content || (Array.isArray(ordersRes.data) ? ordersRes.data : []);
            }
            
            // Sort by latest for the table
            const sortedOrders = [...ordersList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecentOrders(sortedOrders.slice(0, 5));

            // Calculate simplistic stats from current list
            const todayStr = new Date().toDateString();
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toDateString();
            
            let revenue = 0;
            let yesterdayRevenue = 0;
            let pendingCount = 0;
            let preparingCount = 0;
            let todayOrdersCount = 0;
            let yesterdayOrdersCount = 0;

            ordersList.forEach(o => {
                const oDate = new Date(o.createdAt).toDateString();
                if (oDate === todayStr) {
                    todayOrdersCount++;
                    if (o.status === 'COMPLETED') {
                        // Restaurant receives only 95% of totalAmount (5% goes to shipper)
                        revenue += (o.totalAmount || 0) * 0.95;
                    }
                } else if (oDate === yesterdayStr) {
                    yesterdayOrdersCount++;
                    if (o.status === 'COMPLETED') {
                        yesterdayRevenue += (o.totalAmount || 0) * 0.95;
                    }
                }
                
                if (o.status === 'PENDING') pendingCount++;
                if (o.status === 'CONFIRMED' || o.status === 'READY_FOR_PICKUP') preparingCount++;
            });

            // Calculate Trends for Revenue and Orders
            const calculateTrend = (current, previous) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return ((current - previous) / previous) * 100;
            };

            const revTrend = calculateTrend(revenue, yesterdayRevenue);
            const ordTrend = calculateTrend(todayOrdersCount, yesterdayOrdersCount);

            // Calculate Chart Data (Revenue from Last 7 days)
            const daysMap = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 0: 'CN' };
            const orderedDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            const revCounts = { 'T2': 0, 'T3': 0, 'T4': 0, 'T5': 0, 'T6': 0, 'T7': 0, 'CN': 0 };
            
            const todayDate = new Date();
            const startOfWeek = new Date(todayDate);
            const dayOfWeek = todayDate.getDay();
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            startOfWeek.setDate(todayDate.getDate() + diffToMonday);
            startOfWeek.setHours(0, 0, 0, 0);

            ordersList.filter(o => o.status === 'COMPLETED').forEach(o => {
                const completionDate = new Date(o.createdAt);
                if (completionDate >= startOfWeek) {
                    const dayName = daysMap[completionDate.getDay()];
                    if (revCounts[dayName] !== undefined) {
                        revCounts[dayName] += (o.totalAmount || 0) * 0.95;
                    }
                }
            });

            const maxRev = Math.max(...Object.values(revCounts), 1);
            const newChartData = orderedDays.map(day => ({
                day,
                revenue: revCounts[day],
                height: revCounts[day] > 0 ? `${(revCounts[day] / maxRev) * 100}%` : '5%',
                active: daysMap[todayDate.getDay()] === day
            }));
            
            setChartData(newChartData);

            // Fetch Wallet Balance
            let walletBalance = 0;
            let walletTrend = 0;
            try {
                const walletRes = await merchantDashboardService.getWalletBalance();
                if (walletRes.data) {
                    if (typeof walletRes.data.balance === 'number') walletBalance = walletRes.data.balance;
                    if (typeof walletRes.data.monthlyChangePercent === 'number') walletTrend = walletRes.data.monthlyChangePercent;
                }
            } catch (error) {
                console.error('Lỗi khi tải số dư ví:', error);
            }

            setDashboardStats({
                newOrders: todayOrdersCount,
                todayRevenue: revenue,
                pendingOrders: pendingCount,
                preparingOrders: preparingCount,
                walletBalance: walletBalance,
                walletTrend: walletTrend,
                revenueTrend: revTrend,
                ordersTrend: ordTrend
            });
            
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu dashboard', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        if (restaurantData?.status) {
            setRestaurantStatus(restaurantData.status);
        }
    }, [restaurantData]);

    const toggleRestaurantStatus = async () => {
        const newStatus = restaurantStatus === "OPEN" ? "CLOSED" : "OPEN";
        const result = await Swal.fire({
            title: `Xác nhận ${newStatus === "OPEN" ? 'Mở' : 'Đóng'} cửa quán?`,
            text: newStatus === "OPEN" ? "Quán sẽ bắt đầu nhận đơn hàng mới trên ứng dụng." : "Khách hàng sẽ không thể đặt món trong thời gian này.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: newStatus === "OPEN" ? '#10b981' : '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            setIsUpdatingStatus(true);
            try {
                await merchantDashboardService.updateRestaurantStatus({ status: newStatus });
                setRestaurantStatus(newStatus);
                Swal.fire({
                    icon: 'success',
                    title: 'Đã cập nhật',
                    text: `Quán của bạn hiện đang ${newStatus === "OPEN" ? 'Mở cửa' : 'Đóng cửa'}.`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể cập nhật trạng thái quán. Vui lòng thử lại!', 'error');
            } finally {
                setIsUpdatingStatus(false);
            }
        }
    };

    const formatCurrency = (amount) => {
        if (amount == null) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'READY_FOR_PICKUP': return 'bg-primary/20 text-slate-900 dark:text-slate-100';
            case 'DELIVERING': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'CANCELLED': 
            case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const formatTrend = (trend) => {
        if (trend === 0) return '0%';
        return (trend > 0 ? '+' : '') + trend.toFixed(1) + '%';
    };

    const statsConfig = [
        { label: "Số dư Ví hiện tại", value: formatCurrency(dashboardStats.walletBalance), icon: "account_balance_wallet", color: "emerald", trend: formatTrend(dashboardStats.walletTrend), trendIcon: dashboardStats.walletTrend >= 0 ? "trending_up" : "trending_down", isPrimary: true },
        { label: "Doanh thu (95%)", value: formatCurrency(dashboardStats.todayRevenue), icon: "payments", color: "primary", trend: formatTrend(dashboardStats.revenueTrend), trendIcon: dashboardStats.revenueTrend >= 0 ? "trending_up" : "trending_down" },
        { label: "Đơn hàng mới", value: dashboardStats.newOrders.toString(), icon: "shopping_cart", color: "blue", trend: formatTrend(dashboardStats.ordersTrend), trendIcon: dashboardStats.ordersTrend >= 0 ? "trending_up" : "trending_down" },
        { label: "Đang xử lý", value: (dashboardStats.pendingOrders + dashboardStats.preparingOrders).toString(), icon: "pending_actions", color: "amber", trend: "Trong ngày", trendIcon: "timer" }
    ];

    if (contextError?.isNotFound) {
        return (
            <div className="bg-white text-slate-900 h-screen flex font-display">
                <SidebarRestaurant />
                <main className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-background-dark items-center justify-center p-8">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                        <div className="size-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">storefront</span>
                        </div>
                        <h2 className="text-2xl font-black mb-4">Chưa có nhà hàng được gán</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Tài khoản của bạn hiện chưa được liên kết với bất kỳ nhà hàng nào trong hệ thống. Vui lòng liên hệ Admin để được hỗ trợ.
                        </p>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="w-full py-4 bg-primary text-background-dark font-black rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                        >
                            Xem trang cá nhân
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Tổng quan cửa hàng" />

                <div className="p-8 space-y-8 pb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg ${restaurantStatus === 'OPEN' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-slate-500/30'}`}>
                                <span className="material-symbols-outlined">{restaurantStatus === 'OPEN' ? 'storefront' : 'store_closed'}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Trạng thái cửa hàng</h2>
                                <p className="text-sm text-slate-500 font-medium">Bạn có muốn khách hàng tiếp tục đặt món?</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`font-black uppercase tracking-wider text-sm ${restaurantStatus === 'OPEN' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {restaurantStatus === 'OPEN' ? 'Đang mở cửa' : 'Đang đóng cửa'}
                            </span>
                            <button 
                                onClick={toggleRestaurantStatus}
                                disabled={isUpdatingStatus}
                                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors duration-200 ease-in-out ${restaurantStatus === 'OPEN' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <span className="sr-only">Sử dụng nút này</span>
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none absolute left-1 h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${restaurantStatus === 'OPEN' ? 'translate-x-6' : 'translate-x-0'}`}
                                ></span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsConfig.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${
                                        stat.isPrimary ? 'bg-primary/20 text-primary' : 
                                        stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 
                                        stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                                        stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                    }`}>
                                        <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                                    </div>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                                        {stat.trendIcon && <span className="material-symbols-outlined text-sm">{stat.trendIcon}</span>} {stat.trend}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-black mt-2 text-slate-900 dark:text-white truncate">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Chart Area */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Thống kê doanh thu tuần</h3>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                        <span className="size-2 bg-primary rounded-full"></span> Doanh thu
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-64 flex items-end justify-between gap-2 px-2">
                                {chartData.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1 group">
                                        <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 truncate w-full text-center" title={formatCurrency(item.revenue)}>
                                            {item.revenue > 0 ? (item.revenue >= 1000000 ? (item.revenue/1000000).toFixed(1) + 'M' : (item.revenue/1000).toFixed(0) + 'K') : ''}
                                        </span>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-48 overflow-hidden">
                                            <div 
                                                className="absolute bottom-0 w-full bg-primary transition-all rounded-t-sm" 
                                                style={{ height: item.height }}
                                            ></div>
                                        </div>
                                        <span className={`mt-3 text-xs font-bold ${item.active ? 'text-primary' : 'text-slate-500'}`}>
                                            {item.day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Recent Orders Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h4 className="text-lg font-bold">Đơn hàng gần đây</h4>
                            <button onClick={() => navigate('/merchant/orders')} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto min-h-[250px] relative">
                            {loading && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-wider">
                                        <th className="px-6 py-4">Mã đơn</th>
                                        <th className="px-6 py-4">Thời gian</th>
                                        <th className="px-6 py-4">Khách hàng</th>
                                        <th className="px-6 py-4">Tổng tiền</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4 text-right">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold font-mono text-primary">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{formatTime(order.createdAt)}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">{order.recipientName}</td>
                                            <td className="px-6 py-4 text-sm font-black text-slate-800 dark:text-slate-100">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => navigate(`/merchant/orders/${order.id}`)} className="p-2 text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                                                    <span className="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : !loading && (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                                                Chưa có đơn hàng nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantDashboardPage;

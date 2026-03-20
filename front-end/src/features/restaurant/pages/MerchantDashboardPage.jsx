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
        preparingOrders: 0
    });

    const staffPerformance = [
        { name: "Minh Pham", role: "Trưởng bếp", rating: "4.8★", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAes1N0wwMnzOd1BJ56rOw1iIE44_nV6Hxugu0vJCwSkOR5NeKXHXruBQ6frHKrN1c8W5L3z_1rmbSy-46r6S9DBjZfo_VjMnUbxs4LhV02UiRU983bQQ1NyIhbX3Djg0EzAr3qCUATYBWOcrFbqXmAXHhHWUJ9-j6csR55hfdR6gCfw1REwgtYF8CD03Cjo63Ont_7N_4VHu3ZOYUvYMa4GH8-k_o_Yk7R-pYEraHwrHfBchr9v9trf-n9T1g0vK9GhM6SxohxA_-Z" },
        { name: "Lan Nguyen", role: "Đóng gói", rating: "4.5★", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtWStMkk2AeQ26dESrZy6uCdE0E0icXIyYcM_FE4HKAuLIeWmYc5vawh6ZnWIjzdgPp67xY7I6grxoJv_jJL-UjuAP-Zvp9Q4gDrpUaqf-htU8hUspiXEk3fpoM5_gU0ukDalmSTd9ZN0QVvuMZrDtwD096Ly3tbVfzMu7TUh7NOh4ytrHD3hzhEf2xJxIYfL9oCeaomBolLxP01MwAKQc_tXef8DmbSkNCCJwydk4HLqCLroP6YjRSjOW854KIqY8m3veGTtS_6jg" },
        { name: "Tuan Tran", role: "Giao nhận", rating: "4.9★", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA-oTiC0mLnYsPTGKY8RSfWgmUTKDqrlEMztNQD18zsIhUH2cL_7NaPazf8CjpUZ_4b47-Y4Ri565gz4-f-hCUM551Q4u3uiR_8Y9lLNvT40IkDybVa289JJ9NvxSG19O_PGQiV4LQralDEw8OgyRKl3elC_964nQ9e9yl2si1mW97IFpkQr20irdsmepoYzSIX36MyRNq2pnrlmEqpNSyuWof0w11qePEUN7FeCsdcwLqB12EzMGA6oY_4vURe2cV5ehyPhjO3H0e" }
    ];

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
            
            let revenue = 0;
            let pendingCount = 0;
            let preparingCount = 0;
            let todayOrdersCount = 0;

            ordersList.forEach(o => {
                const oDate = new Date(o.createdAt).toDateString();
                if (oDate === todayStr) {
                    todayOrdersCount++;
                    if (o.status === 'COMPLETED') {
                        revenue += o.totalAmount || 0;
                    }
                }
                if (o.status === 'PENDING') pendingCount++;
                if (o.status === 'CONFIRMED' || o.status === 'READY_FOR_PICKUP') preparingCount++;
            });

            // Try fetching from revenue API specifically if available
            try {
                const revRes = await merchantDashboardService.getRevenue({ period: 'today' });
                if (revRes.data && typeof revRes.data.revenue === 'number') {
                    revenue = revRes.data.revenue;
                }
            } catch (ignored) {}

            setDashboardStats({
                newOrders: todayOrdersCount,
                todayRevenue: revenue,
                pendingOrders: pendingCount,
                preparingOrders: preparingCount
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

    const statsConfig = [
        { label: "Đơn hàng mới", value: dashboardStats.newOrders.toString(), icon: "shopping_cart", color: "blue", trend: "+5%", trendIcon: "trending_up" },
        { label: "Doanh thu hôm nay", value: formatCurrency(dashboardStats.todayRevenue), icon: "payments", color: "primary", trend: "+12%", trendIcon: "trending_up", isPrimary: true },
        { label: "Chờ xác nhận", value: dashboardStats.pendingOrders.toString(), icon: "pending_actions", color: "amber", trend: "-2%", trendIcon: "trending_down" },
        { label: "Đang chuẩn bị", value: dashboardStats.preparingOrders.toString(), icon: "outdoor_grill", color: "purple", trend: "0%", trendIcon: "" }
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
                                    <div className={`p-3 rounded-xl ${stat.isPrimary ? 'bg-primary/20 text-primary' : stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-lg font-bold">Thống kê doanh thu tuần</h4>
                                <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 focus:ring-primary outline-none">
                                    <option>7 ngày gần nhất</option>
                                    <option>30 ngày</option>
                                </select>
                            </div>
                            <div className="relative h-[300px] w-full flex items-end justify-between gap-3">
                                {[60, 45, 80, 65, 55, 90, 40].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className={`w-full rounded-t-lg relative group transition-all cursor-pointer ${h === 90 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/20 hover:bg-primary/40'}`}>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm whitespace-nowrap z-10">
                                            {(h/40).toFixed(1)}M VNĐ
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 px-2">
                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => <span key={day}>{day}</span>)}
                            </div>
                        </div>

                        {/* Staff Performance */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
                            <h4 className="text-lg font-bold mb-6">Hiệu suất nhân viên</h4>
                            <div className="space-y-6 flex-1">
                                {staffPerformance.map((staff, idx) => (
                                    <div key={idx} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all">
                                                <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{staff.name}</p>
                                                <p className="text-xs font-semibold text-slate-400">{staff.role}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">{staff.rating}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95">
                                Xem báo cáo chi tiết
                            </button>
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

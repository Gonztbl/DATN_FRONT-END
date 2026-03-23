import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';
import shipperService from '../api/shipperApi';

const ShipperDashboardPage = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('week');

    const [recentHistory, setRecentHistory] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [stats, setStats] = useState([
        { label: 'Tổng đơn', value: '0', unit: 'đơn', trend: '0%', icon: 'package_2', color: 'primary' },
        { label: 'Thành công', value: '0', unit: 'đơn', trend: '0%', icon: 'check_circle', color: 'emerald-500' },
        { label: 'Doanh thu', value: '0', unit: 'đ', trend: '0%', icon: 'payments', color: 'amber-500' },
        { label: 'Đơn hôm nay', value: '0', unit: 'đơn', trend: '0%', icon: 'today', color: 'primary' }
    ]);
    const [loading, setLoading] = useState(false);
    const [walletInfo, setWalletInfo] = useState({ balance: 0, monthlyChangePercent: 0 });

    const [chartData, setChartData] = useState([
        { day: 'T2', height: '0%' },
        { day: 'T3', height: '0%' },
        { day: 'T4', height: '0%' },
        { day: 'T5', height: '0%' },
        { day: 'T6', height: '0%' },
        { day: 'T7', height: '0%' },
        { day: 'CN', height: '0%' }
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch dashboard data in parallel
                const [ordersRes, walletRes] = await Promise.all([
                    shipperService.getOrders({ 
                        assigned: true,
                        limit: 100, 
                        sortBy: 'createdAt', 
                        sortDir: 'desc' 
                    }),
                    shipperService.getWalletBalance().catch(err => {
                        console.error('Error fetching wallet balance:', err);
                        return { data: { balance: 0, monthlyChangePercent: 0 } };
                    })
                ]);

                if (walletRes && walletRes.data) {
                    setWalletInfo(walletRes.data);
                }

                if (ordersRes.data && ordersRes.data.data) {
                    const orders = ordersRes.data.data;
                    
                    // Recent 5 orders for history
                    setRecentHistory(orders.slice(0, 5));
                    
                    // Identify active order (DELIVERING or READY_FOR_PICKUP)
                    const active = orders.find(o => ['READY_FOR_PICKUP', 'DELIVERING'].includes(o.status));
                    setActiveOrder(active);
                    
                    // Calculate stats
                    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
                    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                    
                    const todayDate = new Date();
                    const todayStr = todayDate.toLocaleDateString('vi-VN');
                    
                    // Filter today's completed orders using deliveredAt if available, otherwise fallback to createdAt
                    const todayOrders = completedOrders.filter(o => {
                        const dateObj = new Date(o.deliveredAt || o.createdAt);
                        return dateObj.toLocaleDateString('vi-VN') === todayStr;
                    });
                    
                    setStats([
                        { label: 'Tổng đơn', value: orders.length.toString(), unit: 'đơn', trend: '+0%', icon: 'package_2', color: 'primary' },
                        { label: 'Thành công', value: completedOrders.length.toString(), unit: 'đơn', trend: '+0%', icon: 'check_circle', color: 'emerald-500' },
                        { label: 'Doanh thu', value: formatCurrency(totalRevenue).replace('₫', '').trim(), unit: 'đ', trend: '+0%', icon: 'payments', color: 'amber-500' },
                        { label: 'Giao hôm nay', value: todayOrders.length.toString(), unit: 'đơn', trend: '+0%', icon: 'today', color: 'primary' }
                    ]);

                    // Calculate Chart Data (Last 7 days count)
                    const daysMap = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 0: 'CN' };
                    // Start on Monday (1)
                    const orderedDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                    const counts = { 'T2': 0, 'T3': 0, 'T4': 0, 'T5': 0, 'T6': 0, 'T7': 0, 'CN': 0 };
                    
                    // Filter and count completed orders from current week
                    const startOfWeek = new Date(todayDate);
                    const dayOfWeek = todayDate.getDay();
                    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                    startOfWeek.setDate(todayDate.getDate() + diffToMonday);
                    startOfWeek.setHours(0, 0, 0, 0);

                    completedOrders.forEach(o => {
                        // Use deliveredAt for accurate completion date
                        const completionDate = new Date(o.deliveredAt || o.createdAt);
                        if (completionDate >= startOfWeek) {
                            const dayName = daysMap[completionDate.getDay()];
                            if (counts[dayName] !== undefined) {
                                counts[dayName]++;
                            }
                        }
                    });

                    const maxCount = Math.max(...Object.values(counts), 1);
                    const newChartData = orderedDays.map(day => ({
                        day,
                        count: counts[day],
                        height: counts[day] > 0 ? `${(counts[day] / maxCount) * 100}%` : '5%', // 5% minimum height just to show a bump
                        active: daysMap[todayDate.getDay()] === day
                    }));
                    setChartData(newChartData);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [timeRange]);

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('vi-VN');
    };

    const getStatusTextAndColor = (status) => {
        switch (status) {
            case 'READY_FOR_PICKUP': return { text: 'Chờ lấy hàng', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' };
            case 'DELIVERING': return { text: 'Đang giao', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
            case 'COMPLETED': return { text: 'Hoàn thành', color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' };
            case 'DELIVERY_FAILED': return { text: 'Thất bại', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' };
            default: return { text: status || 'N/A', color: 'text-slate-500 bg-slate-100' };
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <HeaderShipper title="Tổng quan" />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 pb-24">
                    {/* Active Order Banner */}
                    {activeOrder && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-primary shadow-xl shadow-primary/20 border-4 border-white dark:border-slate-800">
                            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-inner animate-bounce">
                                        <span className="material-symbols-outlined text-4xl text-primary">motorcycle</span>
                                    </div>
                                    <div className="text-background-dark">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="inline-block px-2 py-0.5 bg-background-dark/10 rounded-full text-[10px] font-black uppercase tracking-widest">Đang thực hiện</span>
                                            <h2 className="text-2xl font-black italic uppercase tracking-tight">#{activeOrder.orderCode || activeOrder.id}</h2>
                                        </div>
                                        <p className="font-bold opacity-80">{activeOrder.customerName || 'Khách hàng'}</p>
                                        <p className="text-sm opacity-60 line-clamp-1">{activeOrder.deliveryAddress || 'Địa chỉ đang được tải...'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate(`/shipper/orders/${activeOrder.id}`)}
                                    className="w-full md:w-auto px-8 py-4 bg-background-dark text-white rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                                >
                                    Tiếp tục giao <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                                
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 size-40 rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
                            </div>
                        </div>
                    )}

                    {/* Hero Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Thống kê của tôi</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Theo dõi hiệu suất giao hàng và doanh thu của bạn.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Wallet Balance Display */}
                            <div 
                                onClick={() => navigate('/dashboard')}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center gap-4 w-full sm:w-auto transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
                            >
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-2xl group-hover:animate-pulse">account_balance_wallet</span>
                                </div>
                                <div>
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-0.5 flex items-center gap-1">
                                        Ví hoa hồng <span className="material-symbols-outlined text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
                                    </p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-xl font-black tabular-nums">{formatCurrency(walletInfo.balance)}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center w-full sm:w-auto gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 ml-2">calendar_today</span>
                                <select 
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="form-select border-none bg-transparent text-slate-900 dark:text-white font-semibold focus:ring-0 cursor-pointer pr-10 outline-none w-full"
                                >
                                    <option value="week">Tuần này</option>
                                    <option value="month">Tháng này</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 bg-${stat.color === 'primary' ? 'primary/10' : stat.color + '/10'} rounded-lg text-${stat.color}`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <span className={`text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend === '0%' ? 'text-slate-400 bg-slate-50 dark:bg-slate-800' : ''}`}>
                                        {stat.trend !== '0%' && <span className="material-symbols-outlined text-sm">trending_up</span>} {stat.trend}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {stat.value} {stat.unit && <span className="text-lg font-bold text-slate-400">{stat.unit}</span>}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Bar Chart Section */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Khối lượng giao hàng</h3>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                        <span className="size-2 bg-primary rounded-full"></span> Thành công
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-64 flex items-end justify-between gap-2 px-2">
                                {chartData.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1 group">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                            {item.count > 0 ? item.count : ''}
                                        </span>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-48 overflow-hidden">
                                            <div 
                                                className="absolute bottom-0 w-full bg-emerald-500 transition-all rounded-t-sm" 
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

                        {/* Recent History Section */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Lịch sử gần đây</h3>
                                <button onClick={() => navigate('/shipper/orders')} className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {loading && <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}
                                {!loading && recentHistory.length === 0 && <p className="text-center text-slate-500">Chưa có đơn hàng nào.</p>}
                                {!loading && recentHistory.map((item) => {
                                    const statusInfo = getStatusTextAndColor(item.status);
                                    return (
                                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer" onClick={() => navigate(`/shipper/orders/${item.id}`)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`size-10 rounded-lg flex items-center justify-center ${statusInfo.color}`}>
                                                    <span className="material-symbols-outlined text-xl">
                                                        {item.status === 'COMPLETED' ? 'check_circle' : item.status === 'FAILED' ? 'cancel' : item.status === 'DELIVERING' ? 'motorcycle' : 'inventory_2'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">#{item.orderCode || item.id}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{formatTime(item.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.totalAmount)}</p>
                                                <p className={`text-[10px] uppercase font-bold tracking-wider font-display ${statusInfo.color.split(' ')[0]}`}>{statusInfo.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => navigate('/shipper/orders')}
                                className="mt-6 w-full py-4 bg-primary text-background-dark font-black uppercase italic tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Giao đơn mới</span>
                                <span className="material-symbols-outlined">double_arrow</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Bottom Navigation */}
                <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
                    <button 
                        className="flex flex-col items-center gap-1 text-primary"
                        onClick={() => navigate('/shipper/dashboard')}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-[10px] font-bold uppercase">Tổng quan</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400"
                        onClick={() => navigate('/shipper/orders')}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold uppercase">Đơn hàng</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400"
                        onClick={() => navigate('/shipper/profile')}
                    >
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-bold uppercase">Cá nhân</span>
                    </button>
                </footer>
            </div>
            {/* Map Decoration */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-5 dark:opacity-10 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgpX98VtBQEMkbfogqup1t_7AgpSVBaYbtYxuCk_kKHpbEj_r8zI--8r6ckNm6hrkYp3mJixJWogdHqD2X3oMhWICCyIuOiIDLPY40_qmlHcxNPcox7qi2lIyssotFjBy_jZw15Vk-Vs7pbDt4aT9xHbwv1Yi4Djv7XUQjHFkO-VP5pbcE7mClwmj3z2S-_Z4Cg7V-FrJK9MHXj2lDCb7kg0URBQ_0WaQ9VUtB35BODxtJgq-p17uhte6JW5pLfn1QWOKzXbVW5IjQ')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
    );
};

export default ShipperDashboardPage;

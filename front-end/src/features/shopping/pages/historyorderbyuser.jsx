import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../../api/orderService';
import { showError } from '../../../utils/swalUtils';
import { useTheme } from '../../../context/ThemeContext';

const HistoryOrderByUser = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();

    // State management
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [totalElements, setTotalElements] = useState(0);

    // Status Tabs Definition
    const tabs = [
        { label: 'Tất cả', value: 'ALL' },
        { label: 'Chờ duyệt', value: 'PENDING' },
        { label: 'Đã xác nhận', value: 'CONFIRMED' },
        { label: 'Đang chuẩn bị', value: 'PREPARING' },
        { label: 'Chờ lấy hàng', value: 'READY_FOR_PICKUP' },
        { label: 'Đang giao', value: 'DELIVERING' },
        { label: 'Hoàn thành', value: 'COMPLETED' },
        { label: 'Đã hủy', value: 'CANCELLED' }
    ];

    // Fetch orders from API
    const fetchOrders = useCallback(async (pageNum = 0, status = 'ALL', isLoadMore = false) => {
        setLoading(true);
        try {
            const params = {
                page: pageNum,
                size: 10,
                status: status === 'ALL' ? undefined : status,
                sort: 'createdAt,desc'
            };
            
            const response = await orderService.getOrders(params);
            const data = response.data;

            if (data && data.content) {
                if (isLoadMore) {
                    setOrders(prev => [...prev, ...data.content]);
                } else {
                    setOrders(data.content);
                }
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showError("Lỗi", "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load and filter changes
    useEffect(() => {
        setPage(0);
        fetchOrders(0, statusFilter, false);
    }, [statusFilter, fetchOrders]);

    // Handle Load More
    const handleLoadMore = () => {
        const nextPage = page + 1;
        if (nextPage < totalPages) {
            setPage(nextPage);
            fetchOrders(nextPage, statusFilter, true);
        }
    };

    // Helper: Format Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper: Format Date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Helper: Get Status Styles
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { 
                    bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', 
                    icon: 'schedule', 
                    label: 'Chờ duyệt' 
                };
            case 'CONFIRMED':
                return { 
                    bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', 
                    icon: 'verified', 
                    label: 'Đã xác nhận' 
                };
            case 'PREPARING':
                return { 
                    bg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', 
                    icon: 'restaurant_menu', 
                    label: 'Đang chuẩn bị' 
                };
            case 'READY_FOR_PICKUP':
                return { 
                    bg: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', 
                    icon: 'shopping_basket', 
                    label: 'Chờ lấy hàng' 
                };
            case 'DELIVERING':
                return { 
                    bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', 
                    icon: 'local_shipping', 
                    label: 'Đang giao' 
                };
            case 'COMPLETED':
                return { 
                    bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', 
                    icon: 'check_circle', 
                    label: 'Hoàn thành' 
                };
            case 'CANCELLED':
                return { 
                    bg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', 
                    icon: 'cancel', 
                    label: 'Đã hủy' 
                };
            default:
                return { 
                    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', 
                    icon: 'help_outline', 
                    label: status 
                };
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/shopping/food-drink')}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
                                title="Quay lại"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">receipt_long</span>
                                </div>
                                <h1 className="text-xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md ml-8">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                                <input 
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm transition-all text-slate-900 dark:text-slate-100" 
                                    placeholder="Tìm kiếm đơn hàng..." 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 ml-4">
                            <button
                                onClick={toggleDarkMode}
                                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                                title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                            >
                                <span className="material-symbols-outlined transition-all">
                                    {isDarkMode ? "light_mode" : "dark_mode"}
                                </span>
                            </button>
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-primary/10">
                                JS
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                {/* Status Tabs */}
                <div className="mb-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <nav className="flex gap-8 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`px-1 pb-4 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 ${
                                    statusFilter === tab.value 
                                        ? 'border-primary text-primary' 
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab.label}
                                {tab.value === 'ALL' && totalElements > 0 && (
                                    <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs">{totalElements}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search Bar Mobile */}
                <div className="md:hidden mb-6">
                    <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input 
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm shadow-sm" 
                            placeholder="Tìm kiếm đơn hàng..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Order List Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {loading && orders.length === 0 ? (
                        // Skeleton Loader
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-6 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="size-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                                    </div>
                                    <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                            </div>
                        ))
                    ) : orders.length > 0 ? (
                        orders
                            .filter(order => {
                                const searchLower = searchQuery.toLowerCase();
                                const orderItems = order.items || order.orderItems || [];
                                return (
                                    order.id.toString().toLowerCase().includes(searchLower) || 
                                    (order.recipientName || '').toLowerCase().includes(searchLower) ||
                                    (order.restaurantName || '').toLowerCase().includes(searchLower) ||
                                    (order.restaurantId || '').toString().toLowerCase().includes(searchLower) ||
                                    orderItems.some(item => (item.productName || '').toLowerCase().includes(searchLower))
                                );
                            })
                            .map((order) => {
                                const statusInfo = getStatusStyle(order.status);
                                const orderItems = order.items || order.orderItems || [];
                                const totalItems = orderItems.length;
                                // We'll show up to 3 items in a compact gallery
                                const displayItems = orderItems.slice(0, 3);
                                
                                return (
                                    <div 
                                        key={order.id} 
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer mb-4"
                                        onClick={() => navigate(`/shopping/view-order/${order.id}`)}
                                    >
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-4 gap-4 sm:gap-6">
                                            {/* Item Images Gallery - Very Compact */}
                                            <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300 shrink-0">
                                                {displayItems.map((item, idx) => (
                                                    <div key={idx} className="size-16 sm:size-20 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 z-[1] transition-transform hover:z-10 hover:scale-110">
                                                        {item.productImage ? (
                                                            <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <span className="material-symbols-outlined">fastfood</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {totalItems > 3 && (
                                                    <div className="size-16 sm:size-20 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 z-0">
                                                        +{totalItems - 3}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Order Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 italic">#{order.id}</h3>
                                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                                                    <span className={`${statusInfo.bg} text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-md ml-auto sm:ml-0`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-primary">storefront</span>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                                                        {order.restaurantName || 
                                                         order.restaurant_name || 
                                                         order.restaurant?.name || 
                                                         order.merchantName ||
                                                         order.storeName ||
                                                         (orderItems[0]?.restaurantName) ||
                                                         (order.restaurantId ? `Nhà hàng #${order.restaurantId}` : 'Chưa rõ nhà hàng')}
                                                    </p>
                                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                                    <p className="text-xs font-medium text-slate-500">
                                                        {totalItems} {totalItems === 1 ? 'món' : 'món'}
                                                    </p>
                                                </div>
                                                {/* Item Names Inline - Compact */}
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1">
                                                    {orderItems.map(i => i.productName).join(', ')}
                                                </p>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 sm:pl-6 sm:border-l border-slate-100 dark:border-slate-800">
                                                <div className="text-left sm:text-right">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tổng cộng</p>
                                                    <p className="text-2xl font-black text-primary leading-none">{formatCurrency(order.totalAmount)}</p>
                                                </div>
                                                <button 
                                                    className="bg-primary hover:bg-primary-dark text-white font-black py-2 px-5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/shopping/view-order/${order.id}`);
                                                    }}
                                                >
                                                    Theo dõi
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-primary/10 size-40 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-7xl text-primary">shopping_basket</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Không tìm thấy đơn hàng nào</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                                {statusFilter === 'ALL' 
                                    ? "Có vẻ như bạn chưa đặt món nào. Hãy khám phá các nhà hàng của chúng tôi ngay!" 
                                    : `Bạn hiện không có đơn hàng nào ở trạng thái ${statusFilter.toLowerCase()}.`}
                            </p>
                            <button 
                                onClick={() => navigate('/shopping/food-drink')}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                Bắt đầu mua sắm
                            </button>
                        </div>
                    )}
                </div>

                {/* Load More */}
                {!loading && page + 1 < totalPages && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={handleLoadMore}
                            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all p-3 rounded-xl hover:bg-primary/5 active:scale-95"
                        >
                            Xem các đơn hàng cũ hơn
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                    </div>
                )}

                {loading && orders.length > 0 && (
                    <div className="mt-12 flex justify-center items-center gap-3 text-slate-400 text-sm font-medium">
                        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Đang tải thêm đơn hàng...
                    </div>
                )}
            </main>

            <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 bg-slate-100 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary font-bold text-3xl">payments</span>
                            <span className="text-xl font-bold tracking-tight">SmartPay</span>
                        </div>
                        <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400">
                            <a className="hover:text-primary transition-colors hover:underline" href="#">Trung tâm trợ giúp</a>
                            <a className="hover:text-primary transition-colors hover:underline" href="#">Chính sách bảo mật</a>
                            <a className="hover:text-primary transition-colors hover:underline" href="#">Điều khoản dịch vụ</a>
                        </div>
                        <p className="text-xs text-slate-400">© 2024 SmartPay. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HistoryOrderByUser;

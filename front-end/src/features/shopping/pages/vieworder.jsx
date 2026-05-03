import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import orderService from '../../../api/orderService';
import { showSuccess, showError } from '../../../utils/swalUtils';
import { useTheme } from '../../../context/ThemeContext';

const ViewOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Additional info states
    const [shipper, setShipper] = useState(null);
    const [restaurantInfo, setRestaurantInfo] = useState(null);

    const fetchOrderDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        console.log("DEBUG: Fetching order ID", id);
        try {
            const response = await orderService.getOrderById(id);
            console.log("DEBUG: Response received", response?.data);
            if (response && response.data) {
                const orderData = response.data;
                setOrder(orderData);
                
                // Try to fetch tracking if order is progressing
                if (['PREPARING', 'DELIVERING'].includes(orderData.status)) {
                    try {
                        const trackingResponse = await orderService.getTracking(id);
                        if (trackingResponse && trackingResponse.data) {
                            setTracking(trackingResponse.data);
                        }
                    } catch (e) {
                        console.log("DEBUG: No tracking info");
                    }
                }

                // The updated API directly returns product details (name, image) inside the order items.
                // However, we still need to identify the restaurant from the first item if not at root.
                const itemsList = Array.isArray(orderData.items) ? orderData.items : (Array.isArray(orderData.orderItems) ? orderData.orderItems : []);
                
                if (itemsList.length > 0) {
                    const firstItem = itemsList[0];
                    if (firstItem.restaurantName) {
                        setRestaurantInfo({ name: firstItem.restaurantName, id: firstItem.restaurantId });
                    } else {
                        // Fallback: Fetch product details to get restaurant info if missing
                        orderService.getProductById(firstItem.productId).then(pRes => {
                            if (pRes && pRes.data && pRes.data.restaurant) {
                                setRestaurantInfo(pRes.data.restaurant);
                            }
                        }).catch(e => console.warn("Lỗi lấy thông tin nhà hàng từ sản phẩm"));
                    }
                }

                // Shipper info is now provided in a nested object 'shipper' according to the latest API update.
                // Fields: order.shipper.name, order.shipper.phone, order.shipper.avatar


            } else {
                throw new Error("No data returned");
            }
        } catch (error) {
            console.error("DEBUG: Error fetching order:", error);
            // Don't alert here immediately to prevent potential double-render issues or swal conflicts
            if (!order) {
                // Wait a bit to see if we should navigate
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    // Format Currency
    const formatCurrency = (amount) => {
        const val = Number(amount) || 0;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('vi-VN', { 
                day: '2-digit', month: 'short', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });
        } catch (e) { return dateString; }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': 'Đang chờ', 'CONFIRMED': 'Đã xác nhận', 'PREPARING': 'Đang chuẩn bị',
            'DELIVERING': 'Đang giao', 'COMPLETED': 'Đã hoàn thành', 'CANCELLED': 'Đã hủy',
            'DELIVERY_FAILED': 'Giao thất bại'
        };
        return labels[status] || status || 'N/A';
    };

    const handleCancel = async () => {
        if (!order) return;
        const { value: reason } = await Swal.fire({
            title: 'Hủy đơn hàng',
            input: 'text',
            inputLabel: 'Lý do hủy đơn',
            inputPlaceholder: 'Nhập lý do...',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            confirmButtonColor: '#d33',
            inputValidator: (value) => !value && 'Bạn cần nhập lý do hủy đơn!'
        });

        if (reason) {
            setActionLoading(true);
            try {
                await orderService.cancelOrder(order.id, { reason });
                showSuccess("Thành công", "Đã hủy đơn hàng.");
                fetchOrderDetail();
            } catch (error) {
                showError("Lỗi", "Không thể hủy đơn hàng này.");
            } finally { setActionLoading(false); }
        }
    };

    const handleReorder = async () => {
        if (!order) return;
        setActionLoading(true);
        try {
            const res = await orderService.reorder(order.id);
            showSuccess("Thành công", "Đã tạo đơn hàng mới!");
            navigate('/shopping/order-history');
        } catch (err) {
            showError("Lỗi", "Không thể đặt lại đơn.");
        } finally { setActionLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 dark:text-slate-400">Đang tải chi tiết...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 gap-4">
                <p className="text-slate-500 dark:text-slate-400">Không tìm thấy thông tin đơn hàng này.</p>
                <button onClick={() => navigate('/shopping/order-history')} className="text-primary font-bold">Quay lại</button>
            </div>
        );
    }

    const timelineSteps = [
        { status: 'PENDING', label: 'Đã đặt', icon: 'check' },
        { status: 'CONFIRMED', label: 'Xác nhận', icon: 'verified' },
        { status: 'PREPARING', label: 'Đang nấu', icon: 'restaurant' },
        { status: 'READY_FOR_PICKUP', label: 'Chờ lấy hàng', icon: 'shopping_basket' },
        { status: 'DELIVERING', label: 'Đang giao', icon: 'motorcycle' },
        { status: 'COMPLETED', label: 'Hoàn thành', icon: 'done_all' }
    ];

    const statusWeights = {
        'PENDING': 0,
        'CONFIRMED': 1,
        'PREPARING': 2,
        'READY_FOR_PICKUP': 3,
        'DELIVERING': 4,
        'COMPLETED': 5,
        'CANCELLED': -1
    };

    const currentWeight = statusWeights[order.status] ?? -1;
    const isCancelled = order.status === 'CANCELLED';
    const orderItems = Array.isArray(order.items) ? order.items : (Array.isArray(order.orderItems) ? order.orderItems : []);

    const getHistoryTimestamp = (status) => {
        if (!Array.isArray(order?.statusHistory)) return null;
        
        // Define which statuses in history satisfy a timeline step
        const statusAliases = {
            'PENDING': ['PENDING'],
            'CONFIRMED': ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'DELIVERING', 'COMPLETED'],
            'PREPARING': ['PREPARING', 'READY_FOR_PICKUP', 'DELIVERING', 'COMPLETED'],
            'DELIVERING': ['DELIVERING', 'COMPLETED'],
            'COMPLETED': ['COMPLETED']
        };

        const searchStatuses = statusAliases[status] || [status];
        const item = order.statusHistory.find(h => h && searchStatuses.includes(h.status));
        return item ? formatDate(item.timestamp) : null;
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 h-screen flex flex-col overflow-hidden">
            {/* Simple Header */}
            <header className="shrink-0 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/shopping/order-history')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-lg">Chi tiết đơn hàng #{order.id}</h1>
                </div>
                <button
                    onClick={toggleDarkMode}
                    className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                    title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                >
                    <span className="material-symbols-outlined transition-all">
                        {isDarkMode ? "light_mode" : "dark_mode"}
                    </span>
                </button>
            </header>

            <main className="max-w-[1600px] w-full mx-auto p-4 flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Premium Status Hero */}
                <div className="shrink-0 relative rounded-[2rem] overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center p-6 lg:p-8 gap-4 shadow-2xl shadow-emerald-900/10 border border-emerald-100 dark:border-slate-700">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" alt="Food background" className="w-full h-full object-cover opacity-20 dark:opacity-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 via-teal-700/90 to-slate-900/90 dark:from-slate-900/95 dark:to-slate-800/95"></div>
                    </div>
                    
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                <span className="material-symbols-outlined text-white text-3xl">{isCancelled ? 'cancel' : 'local_mall'}</span>
                            </div>
                            <div>
                                 <div className="flex items-center gap-2 mb-1">
                                     <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${isCancelled ? 'bg-red-500 text-white' : 'bg-emerald-400 text-emerald-950'}`}>
                                        {getStatusLabel(order.status)}
                                     </span>
                                 </div>
                                 <h2 className="text-white font-black text-2xl tracking-wide flex items-center gap-2">
                                     Mã đơn #{order.id}
                                 </h2>
                            </div>
                        </div>
                        <p className="text-emerald-100/90 text-sm flex items-center gap-1.5 font-medium ml-[72px]">
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span> {formatDate(order.createdAt)}
                        </p>
                    </div>

                    <div className="flex flex-col items-end relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg mt-4 md:mt-0 w-full md:w-auto">
                        <p className="text-xs text-emerald-100 uppercase font-black tracking-[0.2em] flex items-center gap-1.5 mb-1">
                            <span className="material-symbols-outlined text-[16px]">payments</span> Tổng thanh toán
                        </p>
                        <p className="text-4xl font-black text-white leading-none shadow-sm">{formatCurrency(order.totalAmount)}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-4 gap-4">
                    
                    {/* Col 1: Timeline */}
                    <section className="xl:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm relative">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
                        <h3 className="font-black text-lg mb-6 shrink-0 relative z-10 flex items-center gap-2 text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined text-primary">route</span> Trạng thái xử lý
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-2 relative z-10" style={{ scrollbarWidth: 'thin' }}>
                            <div className="flex flex-col gap-6 relative ml-5 mt-2">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800 ml-4 border-l border-dashed border-slate-200 dark:border-slate-700"></div>
                                {timelineSteps.map((step, idx) => {
                                    const ts = getHistoryTimestamp(step.status);
                                    const stepWeight = statusWeights[step.status];
                                    const active = !isCancelled && stepWeight <= currentWeight;
                                    const isDone = !isCancelled && stepWeight < currentWeight;
                                    
                                    return (
                                        <div key={idx} className="relative flex items-center gap-5">
                                            <div className={`z-10 size-9 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm ${active ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border border-emerald-500 shadow-emerald-500/30' : 'bg-white dark:bg-slate-800 text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                                                <span className="material-symbols-outlined text-[16px]">{isDone ? 'check' : step.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col justify-center">
                                                    <p className={`text-sm font-bold truncate ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</p>
                                                    {ts && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{ts}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {isCancelled && (
                                    <div className="relative flex items-center gap-5">
                                        <div className="z-10 size-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </div>
                                        <p className="text-sm font-bold text-red-600 truncate">Đơn hàng bị hủy</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Col 2 & 3: Items */}
                    <section className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm relative">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 dark:bg-teal-900/10 rounded-full blur-3xl z-0 pointer-events-none opacity-50"></div>
                        <h3 className="font-black text-lg p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 relative z-10 flex items-center gap-2 text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined text-primary">restaurant_menu</span> Chi tiết sản phẩm
                        </h3>
                        <div className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarWidth: 'thin' }}>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-slate-400">Món ăn</th>
                                        <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-slate-400 text-center w-20">SL</th>
                                        <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-slate-400 text-right w-36">Giá</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {orderItems.map((item, i) => {
                                        const name = item.productName || `Món #${item.productId}`;
                                        const image = item.productImage;
                                        
                                        return (
                                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className="size-20 md:size-24 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-shadow">
                                                            {image ? (
                                                                <img src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            ) : <span className="material-symbols-outlined text-slate-300 text-3xl">fastfood</span>}
                                                        </div>
                                                        <span className="font-black text-base text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">{name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1 font-bold text-sm">
                                                        x{item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-emerald-600 text-base">{formatCurrency(item.priceAtTime || item.price)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="shrink-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 p-6 border-t border-emerald-100 dark:border-slate-700 flex justify-between items-center relative z-10">
                            <span className="font-black text-emerald-800 dark:text-emerald-400 uppercase text-xs tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">receipt_long</span> Tổng đơn hàng
                            </span>
                            <span className="text-3xl font-black text-emerald-600">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </section>

                    {/* Col 4: Condensed Details & Actions */}
                    <div className="xl:col-span-1 flex flex-col overflow-hidden h-full">
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'none' }}>
                            {/* Consolidated Information Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
                                {/* Subtle decorative bg */}
                                <div className="absolute top-0 right-0 size-24 bg-emerald-50/50 dark:bg-emerald-900/5 rounded-full blur-2xl z-0"></div>
                                
                                <div className="relative z-10 p-4 space-y-4">
                                    {/* Shipper Section */}
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Tài xế</p>
                                            {order.shipper ? (
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200 uppercase">{order.shipper.name}</p>
                                                    <button className="text-emerald-600 hover:text-emerald-700 font-black text-xs shrink-0">GỌI</button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">Đang tìm tài xế...</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivery Section */}
                                    <div className="flex items-start gap-3">
                                        <div className="size-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">home_pin</span>
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Giao đến</p>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
                                                    <span className="truncate">{order.recipientName || 'N/A'}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium ml-5">{order.recipientPhone || 'N/A'}</p>
                                            </div>
                                            <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">map</span>
                                                <span className="line-clamp-2 leading-tight">{order.deliveryAddress || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Note Section */}
                                    {order.note && (
                                        <div className="flex items-start gap-2.5 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                                            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">edit_note</span>
                                            <p className="text-xs text-amber-800 dark:text-amber-400 font-bold leading-tight line-clamp-2">{order.note}</p>
                                        </div>
                                    )}

                                    {/* Order Meta Footer */}
                                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-tighter"><span className="material-symbols-outlined text-[16px]">storefront</span> Nhà hàng</span>
                                            <span className="font-black text-slate-700 dark:text-slate-200 truncate max-w-[140px] uppercase">{order.restaurantName || restaurantInfo?.name || 'MAXI BURGER'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-tighter"><span className="material-symbols-outlined text-[16px]">payments</span> Thanh toán</span>
                                            <span className="font-black text-primary px-2 py-0.5 bg-primary/10 rounded-md">SmartPay</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions (Pinned to bottom) */}
                        <div className="shrink-0 pt-2 flex gap-3 pb-2">
                            <button onClick={handleReorder} disabled={actionLoading || order.status !== 'COMPLETED'} className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:border-slate-400 text-sm flex items-center justify-center gap-2 border border-emerald-400/50">
                                <span className="material-symbols-outlined text-[20px]">replay</span>
                                Đặt lại ngay
                            </button>
                            {!isCancelled && order.status !== 'COMPLETED' && (
                                <button onClick={handleCancel} disabled={actionLoading || currentWeight > 1} className="flex-1 bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/30 text-red-600 py-3 rounded-2xl font-black hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:border-slate-200 disabled:text-slate-400 text-sm flex items-center justify-center gap-2 hover:shadow-md disabled:cursor-not-allowed">
                                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                                    Hủy đơn
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ViewOrder;

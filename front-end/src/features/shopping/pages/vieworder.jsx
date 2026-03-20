import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Direct import
import orderService from '../../../api/orderService';
import { showSuccess, showError } from '../../../utils/swalUtils';

const ViewOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Additional info states
    const [productDetails, setProductDetails] = useState({});
    const [shipper, setShipper] = useState(null);
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [restaurantOwner, setRestaurantOwner] = useState(null);

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

                // Fetch Additional Info: Products
                const itemsList = Array.isArray(orderData.items) ? orderData.items : (Array.isArray(orderData.orderItems) ? orderData.orderItems : []);
                const pDetailsTemp = {};
                let foundRestaurantInfo = null;

                try {
                    await Promise.all(itemsList.map(async (item) => {
                        try {
                            const pRes = await orderService.getProductById(item.productId);
                            if (pRes && pRes.data) {
                                pDetailsTemp[item.productId] = pRes.data;
                                if (pRes.data.restaurant && !foundRestaurantInfo) {
                                    foundRestaurantInfo = pRes.data.restaurant;
                                }
                            }
                        } catch(e) { console.warn("Lỗi tải SP", item.productId); }
                    }));
                    setProductDetails(pDetailsTemp);
                    if (foundRestaurantInfo) setRestaurantInfo(foundRestaurantInfo);
                } catch(e) { console.error("Lỗi fetch products", e); }

                // Fetch Additional Info: Shipper
                if (orderData.shipperId) {
                    try {
                        const sRes = await orderService.getShipperAdmin(orderData.shipperId);
                        if (sRes && sRes.data) setShipper(sRes.data);
                    } catch(e) { console.warn("Lỗi tải Shipper"); }
                }

                // Fetch Additional Info: Restaurant Owner
                const rId = orderData.restaurantId || (foundRestaurantInfo ? foundRestaurantInfo.id : null);
                if (rId) {
                    try {
                        const rwRes = await orderService.getRestaurantOwners({ page: 0, size: 200 });
                        const contents = rwRes?.data?.content || rwRes?.data || rwRes?.content || (Array.isArray(rwRes) ? rwRes : []);
                        const owner = contents.find(o => o.restaurants?.some(r => String(r.id) === String(rId)));
                        if (owner) setRestaurantOwner(owner);
                    } catch(e) { console.warn("Lỗi tải Chủ quán"); }
                }

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500">Đang tải chi tiết...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <p className="text-slate-500">Không tìm thấy thông tin đơn hàng này.</p>
                <button onClick={() => navigate('/shopping/order-history')} className="text-primary font-bold">Quay lại</button>
            </div>
        );
    }

    const timelineSteps = [
        { status: 'PENDING', label: 'Đã đặt', icon: 'check' },
        { status: 'CONFIRMED', label: 'Xác nhận', icon: 'verified' },
        { status: 'PREPARING', label: 'Đang nấu', icon: 'restaurant' },
        { status: 'DELIVERING', label: 'Đang giao', icon: 'motorcycle' },
        { status: 'COMPLETED', label: 'Hoàn thành', icon: 'done_all' }
    ];

    const currentStatusIndex = timelineSteps.findIndex(s => s.status === order.status);
    const isCancelled = order.status === 'CANCELLED';
    const orderItems = Array.isArray(order.items) ? order.items : (Array.isArray(order.orderItems) ? order.orderItems : []);

    const getHistoryTimestamp = (status) => {
        if (!Array.isArray(order?.statusHistory)) return null;
        const item = order.statusHistory.find(h => h && h.status === status);
        return item ? formatDate(item.timestamp) : null;
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen pb-20">
            {/* Simple Header */}
            <header className="flex items-center gap-4 border-b bg-white dark:bg-slate-900 px-6 py-4 sticky top-0 z-50">
                <button onClick={() => navigate('/shopping/order-history')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg">Chi tiết đơn hàng #{order.id}</h1>
            </header>

            <main className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
                {/* Status Hero */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {getStatusLabel(order.status)}
                             </span>
                        </div>
                        <p className="text-xs text-slate-500">Mã đơn: {order.id} • Ngày đặt: {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-xs text-slate-500 uppercase font-bold">Tổng thanh toán</p>
                        <p className="text-2xl font-black text-emerald-600">{formatCurrency(order.totalAmount)}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timeline */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border">
                            <h3 className="font-bold mb-6">Trạng thái xử lý</h3>
                            <div className="flex flex-col gap-6 relative ml-4">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 ml-3.5"></div>
                                {timelineSteps.map((step, idx) => {
                                    const ts = getHistoryTimestamp(step.status);
                                    const active = !isCancelled && idx <= currentStatusIndex;
                                    return (
                                        <div key={idx} className="relative flex items-center gap-6">
                                            <div className={`z-10 size-8 rounded-full flex items-center justify-center transition-all ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                <span className="material-symbols-outlined text-sm">{active ? (idx < currentStatusIndex ? 'check' : step.icon) : step.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-sm font-bold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</p>
                                                    {ts && <p className="text-[10px] text-slate-400">{ts}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {isCancelled && (
                                    <div className="relative flex items-center gap-6">
                                        <div className="z-10 size-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </div>
                                        <p className="text-sm font-bold text-red-600">Đơn hàng bị hủy</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Items */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
                            <h3 className="font-bold p-6 border-b">Chi tiết sản phẩm</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Món ăn</th>
                                            <th className="px-6 py-4 font-bold text-center">SL</th>
                                            <th className="px-6 py-4 font-bold text-right">Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {orderItems.map((item, i) => {
                                            const pDetail = productDetails[item.productId] || {};
                                            const name = pDetail.name || item.productName || `Món #${item.productId}`;
                                            const image = pDetail.imageBase64 || item.productImage;
                                            
                                            return (
                                                <tr key={i}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                                                {image ? (
                                                                    <img src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`} className="w-full h-full object-cover" />
                                                                ) : <span className="material-symbols-outlined text-slate-400 text-sm">fastfood</span>}
                                                            </div>
                                                            <span className="font-medium">{name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-right">{formatCurrency(item.priceAtTime || item.price)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                                        <tr>
                                            <td colSpan="2" className="px-6 py-4 text-right text-slate-500">Tạm tính</td>
                                            <td className="px-6 py-4 text-right text-emerald-600">{formatCurrency(order.totalAmount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        {/* Delivery Info */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
                            <div className="flex items-center gap-2 border-b pb-3.6">
                                <span className="material-symbols-outlined text-emerald-600">location_on</span>
                                <h3 className="font-bold text-sm">Thông tin nhận hàng</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">Người nhận</p>
                                    <p className="text-sm font-bold uppercase">{order.recipientName || 'N/A'}</p>
                                    <p className="text-xs text-slate-500">{order.recipientPhone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">Địa chỉ</p>
                                    <p className="text-xs">{order.deliveryAddress || 'N/A'}</p>
                                </div>
                                {order.note && (
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-100 dark:border-amber-900/30">
                                        <p className="text-[10px] text-amber-600 font-bold">Ghi chú: {order.note}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Order Info */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <span className="material-symbols-outlined text-emerald-600">info</span>
                                <h3 className="font-bold text-sm">Thông tin đơn hàng</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Phương thức:</span>
                                    <span className="font-bold">{order.paymentMethod || 'Ví SmartPay'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Trạng thái:</span>
                                    <span className="font-bold text-emerald-600">{getStatusLabel(order.status)}</span>
                                </div>
                            </div>
                        </section>

                        {/* Restaurant Info */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <span className="material-symbols-outlined text-emerald-600">storefront</span>
                                <h3 className="font-bold text-sm">Thông tin nhà hàng</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">Nhà hàng</p>
                                    <p className="text-sm font-bold">{restaurantInfo?.name || order.restaurantName || `Nhà hàng #${order.restaurantId || 'N/A'}`}</p>
                                </div>
                                {restaurantOwner && (
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Liên hệ chủ quán</p>
                                        <p className="text-xs">{restaurantOwner.fullName} - {restaurantOwner.phone || 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Shipper Info */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <span className="material-symbols-outlined text-emerald-600">two_wheeler</span>
                                <h3 className="font-bold text-sm">Tài xế nhận giao</h3>
                            </div>
                            {shipper ? (
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-600 flex items-center justify-center overflow-hidden shrink-0">
                                        {shipper.avatarUrl ? (
                                            <img src={shipper.avatarUrl} alt={shipper.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined">person</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold uppercase truncate">{shipper.fullName || shipper.userName}</p>
                                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                                            {shipper.phone || 'Không có SĐT'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                                    <p className="text-xs text-slate-500 italic">Chưa chỉ định tài xế</p>
                                </div>
                            )}
                        </section>

                        {/* Actions */}
                        <div className="space-y-3 pt-4">
                            <button onClick={handleReorder} disabled={actionLoading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50">
                                {actionLoading ? 'Đang lý...' : 'Đặt lại ngay'}
                            </button>
                            {!isCancelled && order.status !== 'COMPLETED' && (
                                <button onClick={handleCancel} disabled={actionLoading || currentStatusIndex > 1} className="w-full border border-red-100 dark:border-red-900/30 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-30 disabled:border-slate-100 disabled:text-slate-300">
                                    {currentStatusIndex > 1 ? 'Không thể hủy' : 'Hủy đơn hàng'}
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

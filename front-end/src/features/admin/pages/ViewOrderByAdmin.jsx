import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import adminOrderService from '../api/adminOrderService';
import userManageService from '../api/userManageService';
import { useNotification } from '../../../context/NotificationContext';
import Swal from 'sweetalert2';

const ViewOrderByAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showError, showSuccess } = useNotification();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    
    // Additional Details State
    const [shipperData, setShipperData] = useState(null);
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [restaurantOwner, setRestaurantOwner] = useState(null);
    const [productDetails, setProductDetails] = useState({});
    const [customerInfo, setCustomerInfo] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    const fetchOrderDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminOrderService.getOrderDetail(id);
            if (response && response.data) {
                const oData = response.data;
                setOrder(oData);
                setSelectedStatus(oData.status);
                
                // Fetch Products & Restaurant info
                let foundRestaurantInfo = null;
                const pDetailsTemp = {};
                const itemsList = Array.isArray(oData.items) ? oData.items : (Array.isArray(oData.orderItems) ? oData.orderItems : []);
                
                try {
                    await Promise.all(itemsList.map(async (item) => {
                        try {
                            const pRes = await adminOrderService.getProductById(item.productId);
                            if (pRes?.data) {
                                pDetailsTemp[item.productId] = pRes.data;
                                if (pRes.data.restaurant && !foundRestaurantInfo) {
                                    foundRestaurantInfo = pRes.data.restaurant;
                                }
                            }
                        } catch(e) {}
                    }));
                    setProductDetails(pDetailsTemp);
                    if (foundRestaurantInfo) setRestaurantInfo(foundRestaurantInfo);
                } catch(e) {}

                // Fetch Shipper Info
                if (oData.shipperId) {
                    try {
                        const sRes = await adminOrderService.getShipperDetail(oData.shipperId);
                        if (sRes?.data) setShipperData(sRes.data);
                    } catch(e) {}
                }

                // Fetch Restaurant Owner Phone
                const rId = oData.restaurant?.id || oData.restaurantId || (foundRestaurantInfo ? foundRestaurantInfo.id : null);
                if (rId) {
                    try {
                        const owRes = await adminOrderService.getRestaurantOwners({ page: 0, size: 200 });
                        const contents = owRes?.data?.content || owRes?.data || owRes?.content || (Array.isArray(owRes) ? owRes : []);
                        const owner = contents.find(o => o.restaurants?.some(r => String(r.id) === String(rId)));
                        if (owner) setRestaurantOwner(owner);
                    } catch(e) {}
                }

                // Fetch Customer Info
                const uId = oData.user?.id || oData.userId;
                if (uId) {
                    try {
                        const cRes = await userManageService.getUserById(uId);
                        if (cRes) setCustomerInfo(cRes);
                    } catch(e) {}
                }
            }
        } catch (error) {
            console.error("Error fetching order details for admin:", error);
            showError("Không thể tải thông tin chi tiết đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const handleSaveStatus = async () => {
        if (!selectedStatus || selectedStatus === order?.status) return;
        setActionLoading(true);
        try {
            await adminOrderService.updateOrderStatus(id, selectedStatus);
            showSuccess("Cập nhật trạng thái thành công!");
            fetchOrderDetails();
        } catch (error) {
            console.error("Error updating order status:", error);
            showError("Lỗi khi cập nhật trạng thái.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) {
            showError("Vui lòng chọn hoặc nhập lý do hủy.");
            return;
        }
        setActionLoading(true);
        try {
            const response = await adminOrderService.cancelOrder(id, cancelReason);
            if (response.data && response.data.refundTransactionId) {
                showSuccess(`Đã hủy đơn hàng thành công. Hoàn tiền: ${response.data.refundTransactionId}`);
            } else {
                showSuccess("Đã hủy đơn hàng thành công.");
            }
            fetchOrderDetails();
        } catch (error) {
            console.error("Error cancelling order:", error);
            showError("Lỗi khi hủy đơn hàng.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white text-slate-900 h-screen flex font-display">
                <SidebarAdmin />
                <main className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-background-dark h-screen w-full">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500">Đang tải thông tin đơn hàng...</p>
                </main>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white text-slate-900 h-screen flex font-display">
                <SidebarAdmin />
                <main className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-background-dark h-screen w-full">
                    <span className="material-symbols-outlined text-6xl text-slate-300">error</span>
                    <p className="mt-4 text-slate-500">Không tìm thấy đơn hàng #{id}</p>
                    <button onClick={() => navigate('/admin/orders')} className="mt-4 text-primary font-bold">Quay lại danh sách</button>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarAdmin />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderAdmin title={`Chi tiết đơn hàng #${order.id}`} />

                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/admin/orders')}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center text-slate-600 dark:text-slate-400"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Chi tiết đơn hàng #{order.id}</h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">SmartPay Delivery</span>
                                    <span className="text-xs text-slate-500">ID: {order.id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-symbols-outlined text-sm">print</span>
                                In hóa đơn
                            </button>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>
                            <button 
                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                disabled={actionLoading || selectedStatus === order?.status}
                                onClick={handleSaveStatus}
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trạng thái đơn hàng</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                disabled={actionLoading}
                                className="w-full bg-primary/10 border-none text-primary font-bold rounded-lg focus:ring-primary text-sm p-2.5 cursor-pointer"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="PREPARING">PREPARING</option>
                                <option value="READY">READY_FOR_PICKUP</option>
                                <option value="DELIVERING">DELIVERING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="DELIVERY_FAILED">DELIVERY_FAILED</option>
                            </select>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ngày tạo</label>
                            <div className="text-lg font-bold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                            <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tổng giá trị</label>
                            <div className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
                            <div className="text-xs text-slate-400">Đã bao gồm phí và VAT</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phương thức thanh toán</label>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                                <div className="text-lg font-bold">{order.payment?.method || order.paymentMethod || 'Ví SmartPay'}</div>
                            </div>
                            <div className="text-xs text-emerald-600 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                Đã thanh toán
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* Entity Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <span className="material-symbols-outlined">person</span>
                                        <h3 className="font-bold">Khách hàng</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Người đặt đơn</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">{order.fullName || order.userName || customerInfo?.fullName || customerInfo?.userName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Người nhận hàng</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">{order.recipientName || 'N/A'}</p>
                                            <p className="text-sm text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{order.recipientPhone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tight">Địa chỉ giao hàng</p>
                                        <p className="text-xs leading-relaxed">{order.deliveryAddress || order.address || customerInfo?.address || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <span className="material-symbols-outlined">restaurant</span>
                                        <h3 className="font-bold">Nhà hàng</h3>
                                    </div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">{restaurantInfo?.name || order.restaurant?.name || order.restaurantName || `Nhà hàng #${order.restaurant?.id || order.restaurantId || 'N/A'}`}</p>
                                    <p className="text-sm text-slate-500 mt-1">{restaurantOwner ? `${restaurantOwner.fullName} - ${restaurantOwner.phone || 'N/A'}` : (order.restaurant?.phone || order.restaurantPhone || 'N/A')}</p>
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tight">Địa chỉ lấy hàng</p>
                                        <p className="text-xs leading-relaxed">{order.restaurant?.address || order.restaurantAddress || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <span className="material-symbols-outlined">delivery_dining</span>
                                        <h3 className="font-bold">Tài xế</h3>
                                    </div>
                                    {shipperData || order.shipperName ? (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-primary/20 overflow-hidden shrink-0">
                                                    {shipperData?.avatarUrl ? (
                                                        <img src={shipperData.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-slate-400">person</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{shipperData?.fullName || order.shipperName}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter truncate">
                                                        ID: {shipperData?.id || order.shipperId || 'N/A'} {shipperData?.phone ? `• ${shipperData.phone}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Trạng thái shipper</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`size-2 rounded-full shadow-sm ${shipperData?.active !== false ? 'bg-emerald-500 shadow-emerald-200' : 'bg-amber-500 shadow-amber-200'}`}></span>
                                                        <p className={`text-[10px] font-bold ${shipperData?.active !== false ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                            {shipperData?.active !== false ? 'Sẵn sàng' : 'Tạm nghỉ'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-24 text-center">
                                            <span className="material-symbols-outlined text-slate-300">mood_bad</span>
                                            <p className="text-xs text-slate-400 font-medium italic mt-2">Chưa chỉ định shipper</p>
                                            <button className="mt-2 text-[10px] font-bold text-primary border border-primary/20 px-2 py-1 rounded hover:bg-primary/5 cursor-not-allowed opacity-50" title="Tính năng này đang phát triển" disabled>CHỜ CHỈ ĐỊNH</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-4">
                                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Danh sách món ăn</h3>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full uppercase tracking-tighter">
                                        {(order.items || order.orderItems || []).length} món trong đơn
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                <th className="px-6 py-4">Sản phẩm</th>
                                                <th className="px-6 py-4 text-center">Số lượng</th>
                                                <th className="px-6 py-4 text-right">Đơn giá</th>
                                                <th className="px-6 py-4 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {(order.items || order.orderItems || []).map((item, index) => {
                                                const pDetail = productDetails[item.productId] || {};
                                                const name = pDetail.name || item.productName || `Món #${item.productId}`;
                                                const image = pDetail.imageBase64 || item.image || item.productImage;
                                                return (
                                                <tr key={index}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                                                {image ? (
                                                                    <img src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`} className="w-full h-full object-cover" alt="item" />
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-slate-400 text-lg">fastfood</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{name}</p>
                                                                {item.note && <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">Note: {item.note}</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-bold text-sm">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-right text-sm">{formatCurrency(item.priceAtTime || item.price)}</td>
                                                    <td className="px-6 py-4 text-right font-black text-sm text-slate-900 dark:text-slate-100">
                                                        {formatCurrency(item.subtotal || (item.priceAtTime || item.price || 0) * (item.quantity || 0))}
                                                    </td>
                                                </tr>
                                            )})}
                                        </tbody>
                                        <tfoot className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr className="text-slate-500 font-bold border-t border-slate-200 dark:border-slate-700">
                                                <td className="px-6 py-3 text-right text-sm" colSpan="3">Tạm tính:</td>
                                                <td className="px-6 py-3 text-right text-sm text-slate-900 dark:text-slate-100">{formatCurrency(order.totalAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 text-right text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter" colSpan="3">Tổng thanh toán:</td>
                                                <td className="px-6 py-4 text-right text-xl font-black text-primary">{formatCurrency(order.totalAmount)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-6">
                            {/* Timeline */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                                <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">history</span>
                                    Lịch trình đơn hàng
                                </h3>
                                <div className="space-y-8 relative ml-4">
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 ml-3.5"></div>
                                    
                                    {(order.statusHistory || []).map((history, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between gap-4">
                                            <div className="flex items-center">
                                                <div className="absolute left-0 size-8 flex items-center justify-center bg-primary text-white rounded-full ring-4 ring-white dark:ring-slate-900 z-10 shadow-sm shadow-primary/40">
                                                    <span className="material-symbols-outlined text-sm">
                                                        {history.status === 'PENDING' ? 'shopping_cart' : 
                                                         history.status === 'CONFIRMED' ? 'check_circle' : 
                                                         history.status === 'PREPARING' ? 'skillet' : 'local_shipping'}
                                                    </span>
                                                </div>
                                                <div className="ml-12">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{history.status}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium italic">{history.note || '—'}</p>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                                {new Date(history.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {order.status === 'CANCELLED' && (
                                         <div className="relative flex items-center justify-between gap-4">
                                            <div className="flex items-center">
                                                <div className="absolute left-0 size-8 flex items-center justify-center bg-rose-600 text-white rounded-full ring-4 ring-white dark:ring-slate-900 z-10 shadow-lg shadow-rose-200">
                                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                                </div>
                                                <div className="ml-12">
                                                    <p className="text-sm font-bold text-rose-600 uppercase tracking-tighter">CANCELLED</p>
                                                    <p className="text-[10px] text-rose-400 italic font-medium">Đơn hàng bị hủy</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                                <h3 className="font-bold text-lg mb-2">Thao tác quản trị</h3>
                                <div className="space-y-4">
                                    <div className="pt-2">
                                        <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">Hủy đơn hàng</label>
                                        <div className="flex flex-col gap-3">
                                            <select 
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                className="w-full text-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-rose-500 focus:ring-rose-500 h-11 px-3"
                                            >
                                                <option value="">-- Lý do hủy đơn --</option>
                                                <option value="Hết hàng">Sản phẩm hết hàng</option>
                                                <option value="Khách hủy">Khách hàng yêu cầu hủy</option>
                                                <option value="Sự cố">Sự cố vận hành/tài xế</option>
                                                <option value="Khác">Lý do khác...</option>
                                            </select>
                                            <button 
                                                onClick={handleCancelOrder}
                                                disabled={actionLoading || !cancelReason}
                                                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm uppercase tracking-tighter transition-all shadow-xl shadow-rose-100 dark:shadow-none disabled:opacity-30 flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">cancel</span>
                                                Xác nhận hủy đơn hàng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-6 text-center text-slate-400 text-xs font-medium">
                    <p>© 2024 SmartPay Fintech Solution. Hệ thống quản trị nội bộ v2.0</p>
                </footer>
            </main>
        </div>
    );
};

export default ViewOrderByAdmin;

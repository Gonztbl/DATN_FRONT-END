import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';
import merchantOrderService from '../api/merchantOrderService';
import { useRestaurant } from '../context/RestaurantContext';
import Swal from 'sweetalert2';

const MerchantOrderDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { error: contextError } = useRestaurant();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await merchantOrderService.getOrderDetail(id);
            if (res.data) {
                setOrder(res.data.data || res.data);
            }
        } catch (error) {
            console.error('Lỗi tải chi tiết đơn hàng:', error);
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải chi tiết đơn hàng. Có thể đơn hàng không tồn tại.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrderDetail();
        }
    }, [id]);

    const formatCurrency = (amount) => {
        if (amount == null) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('vi-VN');
    };

    const getStatusLabelStyles = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ duyệt', styles: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200' };
            case 'CONFIRMED': return { text: 'Đã xác nhận', styles: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200' };
            case 'READY_FOR_PICKUP': return { text: 'Chờ lấy hàng', styles: 'bg-primary/20 text-slate-900 dark:text-slate-100 border-primary/30' };
            case 'DELIVERING': return { text: 'Đang giao', styles: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200' };
            case 'COMPLETED': return { text: 'Hoàn thành', styles: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200' };
            case 'CANCELLED': 
            case 'FAILED': return { text: 'Thất bại/Hủy', styles: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200' };
            default: return { text: status || 'Không rõ', styles: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200' };
        }
    };

    const handleConfirm = async () => {
        try {
            await merchantOrderService.confirmOrder(id);
            Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã xác nhận đơn hàng', timer: 1500, showConfirmButton: false });
            fetchOrderDetail();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xác nhận đơn hàng' });
        }
    };

    const handleReady = async () => {
        try {
            await merchantOrderService.markOrderReady(id);
            Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã báo món sẵn sàng', timer: 1500, showConfirmButton: false });
            fetchOrderDetail();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật trạng thái' });
        }
    };

    const handleReject = async () => {
        const { value: reason } = await Swal.fire({
            title: 'Từ chối đơn hàng?',
            input: 'textarea',
            inputLabel: 'Nhập lý do từ chối/hủy đơn',
            inputPlaceholder: 'Ví dụ: Quán đã hết nguyên liệu...',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận hủy',
            cancelButtonText: 'Đóng',
            confirmButtonColor: '#ef4444'
        });

        if (reason !== undefined) {
            try {
                await merchantOrderService.rejectOrder(id, { reason });
                Swal.fire({ icon: 'success', title: 'Đã hủy', text: 'Đơn hàng đã bị từ chối thành công', timer: 1500, showConfirmButton: false });
                fetchOrderDetail();
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể thực hiện hủy đơn hàng' });
            }
        }
    };

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

    if (loading) {
        return (
            <div className="bg-white text-slate-900 h-screen flex font-display">
                <SidebarRestaurant />
                <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                    <HeaderRestaurant title="Đang tải..." />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white text-slate-900 h-screen flex font-display">
                <SidebarRestaurant />
                <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                    <HeaderRestaurant title="Chi tiết đơn hàng" />
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">warning</span>
                        <p className="text-xl font-bold">Không tìm thấy đơn hàng</p>
                        <button onClick={() => navigate('/merchant/orders')} className="mt-4 px-6 py-2 bg-primary text-slate-900 rounded-lg font-bold">Quay lại danh sách</button>
                    </div>
                </main>
            </div>
        );
    }

    const statusInfo = getStatusLabelStyles(order.status);
    const orderItems = order.items || order.orderItems || [];
    const timeline = order.statusHistory || [
        { status: 'CREATED', timestamp: order.createdAt },
        { status: order.status, timestamp: order.updatedAt || order.createdAt }
    ].filter((v, i, a) => i === 0 || v.status !== a[i-1].status);

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <div className="sticky top-0 z-40">
                    <HeaderRestaurant title={`Đơn hàng #${order.id}`} />
                </div>

                <div className="p-8 pb-32">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <button onClick={() => navigate('/merchant/orders')} className="hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center -ml-2">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            Chi tiết {order.orderCode || `#ORD-${order.id}`}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500 font-medium">Trạng thái:</span>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusInfo.styles}`}>
                                {statusInfo.text}
                            </span>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items & Timeline */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">restaurant</span>
                                        Món ăn đã đặt
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium">{orderItems.length} sản phẩm</p>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {orderItems.length > 0 ? orderItems.map((item, idx) => (
                                        <div key={idx} className="p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="h-20 w-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-300 text-3xl">fastfood</span>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 line-clamp-1">{item.productName}</h3>
                                                <div className="flex justify-between items-center mt-2">
                                                    <p className="font-black text-primary text-base">x {item.quantity}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">{formatCurrency((item.price || item.priceAtTime) * item.quantity)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-slate-500 italic">Không có chi tiết mặt hàng.</div>
                                    )}
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 space-y-3 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-slate-500 font-medium">Tạm tính</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                    {/* Additional fees like shipping could go here if relevant to the merchant view */}
                                    <div className="flex justify-between font-black text-xl pt-4 border-t border-slate-200 dark:border-slate-700 mt-2">
                                        <span className="text-slate-900 dark:text-white uppercase tracking-tight">Tổng thanh toán</span>
                                        <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">history</span>
                                    Lịch sử cập nhật
                                </h2>
                                <div className="space-y-6">
                                    {timeline.length > 0 ? timeline.map((event, idx) => (
                                        <div key={idx} className="flex gap-4 relative">
                                            <div className="flex flex-col items-center">
                                                <div className="size-3 rounded-full bg-primary ring-4 ring-primary/20 z-10"></div>
                                                {idx !== timeline.length - 1 && <div className="w-px h-full bg-slate-200 dark:bg-slate-800 absolute top-3 bottom-[-24px]"></div>}
                                            </div>
                                            <div className="pb-4">
                                                <p className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-200">{getStatusLabelStyles(event.status).text}</p>
                                                <p className="text-xs text-slate-500 mt-1 font-medium">{formatTime(event.timestamp)}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-slate-500 italic text-center py-4">Chưa có bản ghi lịch sử.</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Customer & Actions */}
                        <div className="space-y-8">
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Khách hàng
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tên khách hàng</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{order.customerName || order.recipientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-100 font-mono tracking-tight">{order.customerPhone || order.recipientPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Địa chỉ giao hàng</p>
                                        <p className="text-sm leading-relaxed font-medium bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                            {order.deliveryAddress}
                                        </p>
                                    </div>
                                    {order.note && (
                                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 mt-4">
                                            <p className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">info</span> Ghi chú của khách
                                            </p>
                                            <p className="text-sm text-amber-900 dark:text-amber-200 italic font-medium">"{order.note}"</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <span className="material-symbols-outlined text-emerald-500">payments</span>
                                    Thanh toán & Giao hàng
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                        <span className="text-sm text-slate-500 font-bold">Phương thức</span>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                                            {order.paymentMethod || 'SmartPay'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mt-2">
                                        <span className="text-sm text-slate-500 font-bold">Shipper</span>
                                        <span className="flex items-center gap-1.5 text-sm font-black text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-lg opacity-50">moped</span>
                                            {order.shipperId ? `ID: ${order.shipperId}` : 'Chưa có'}
                                        </span>
                                    </div>
                                </div>
                            </section>
                            
                            {/* Merchant Actions Base on Status */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky bottom-8">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Thao tác quán</h3>
                                <div className="space-y-3">
                                    {order.status === 'PENDING' && (
                                        <>
                                            <button onClick={handleConfirm} className="w-full py-4 px-6 bg-primary text-background-dark font-black text-sm uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined font-bold">thumb_up</span>
                                                Nhận Đơn Hàng
                                            </button>
                                            <button onClick={handleReject} className="w-full py-3 px-6 bg-white dark:bg-slate-900 border-2 border-red-500 text-red-500 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2 active:scale-95">
                                                <span className="material-symbols-outlined font-bold">cancel</span>
                                                Từ Chối
                                            </button>
                                        </>
                                    )}
                                    
                                    {order.status === 'CONFIRMED' && (
                                        <button onClick={handleReady} className="w-full py-4 px-6 bg-blue-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined font-bold">check_circle</span>
                                            Đã Làm Xong Món
                                        </button>
                                    )}

                                    {['READY_FOR_PICKUP', 'DELIVERING', 'COMPLETED', 'CANCELLED', 'FAILED'].includes(order.status) && (
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-sm font-bold text-slate-500">Đơn hàng không thể thay đổi trạng thái lúc này</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantOrderDetailPage;

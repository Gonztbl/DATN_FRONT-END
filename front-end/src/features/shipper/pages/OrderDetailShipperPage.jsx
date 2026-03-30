import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';
import shipperService from '../api/shipperApi';
import Swal from 'sweetalert2';

const OrderDetailShipperPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showFailModal, setShowFailModal] = useState(false);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Fail modal state
    const [failReason, setFailReason] = useState('Khách vắng nhà');
    const [failNote, setFailNote] = useState('');

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const res = await shipperService.getOrderDetail(id);
            if (res.data) {
                setOrder(res.data);
            }
        } catch (error) {
            console.error('Error fetching order detail:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải chi tiết đơn hàng.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handlePickedUp = async () => {
        try {
            await shipperService.pickedUpOrder(id);
            Swal.fire({icon: 'success', title: 'Thành công', text: 'Đã xác nhận lấy hàng!', timer: 1500, showConfirmButton: false});
            fetchOrder();
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Lỗi', text: 'Không thể xác nhận lấy hàng'});
        }
    };

    const handleDelivered = async () => {
        try {
            await shipperService.deliveredOrder(id, { photoBase64: '' });
            Swal.fire({
                icon: 'success', 
                title: 'Thành công', 
                text: 'Đã xác nhận giao hàng! Sẽ quay lại danh sách sau 5 giây.', 
                timer: 5000, 
                showConfirmButton: true,
                confirmButtonText: 'Quay lại ngay'
            }).then(() => {
                navigate('/shipper/orders');
            });

            // Fallback redirect if user doesn't click
            setTimeout(() => {
                navigate('/shipper/orders');
            }, 5000);
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Lỗi', text: 'Không thể xác nhận giao hàng'});
        }
    };

    const handleFailSubmit = async () => {
        if (!failReason) {
            return;
        }
        try {
            const reasonToSubmit = failNote ? `${failReason} - ${failNote}` : failReason;
            await shipperService.failOrder(id, { reason: reasonToSubmit, photoBase64: '' });
            setShowFailModal(false);
            Swal.fire({
                icon: 'success', 
                title: 'Thành công', 
                text: 'Đã báo cáo giao hàng thất bại. Sẽ quay lại danh sách sau 5 giây.', 
                timer: 5000, 
                showConfirmButton: true,
                confirmButtonText: 'Quay lại ngay'
            }).then(() => {
                navigate('/shipper/orders');
            });

            // Fallback redirect
            setTimeout(() => {
                navigate('/shipper/orders');
            }, 5000);
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Lỗi', text: 'Không thể báo cáo thất bại'});
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': 'Đang chờ',
            'CONFIRMED': 'Đã xác nhận',
            'PREPARING': 'Đang chuẩn bị',
            'READY_FOR_PICKUP': 'Chờ lấy hàng',
            'DELIVERING': 'Đang giao',
            'COMPLETED': 'Hoàn thành',
            'CANCELLED': 'Đã hủy',
            'DELIVERY_FAILED': 'Giao thất bại'
        };
        return labels[status] || status;
    };

    const getPaymentStatusLabel = (status) => {
        const labels = {
            'PENDING': 'Chờ thanh toán',
            'COMPLETED': 'Đã thanh toán',
            'FAILED': 'Thanh toán thất bại',
            'REFUNDED': 'Đã hoàn tiền'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 items-center justify-center">
                <p>Không tìm thấy đơn hàng</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <HeaderShipper title={`Đơn hàng #${order.orderCode || id}`} showBack={true} />

                <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-4 p-4">
                    {/* Customer Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="mb-3 flex items-center justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 font-bold text-primary">
                                <span className="material-symbols-outlined">person</span> Khách hàng
                            </h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-full bg-cover bg-slate-200 dark:bg-slate-800 bg-center border border-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                </div>
                                <div>
                                    <p className="font-bold">{order.customer?.name}</p>
                                    <p className="text-sm text-slate-500">{order.customer?.phone}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-slate-900 shadow-sm shadow-primary/30 transition-transform active:scale-95" onClick={() => window.open(`tel:${order.customer?.phone}`)}>
                                <span className="material-symbols-outlined text-sm">call</span>
                                Gọi điện
                            </button>
                        </div>
                        <div className="mt-4 flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Địa chỉ giao hàng</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{order.customer?.address}</p>
                                {order.note && <p className="mt-1 text-sm italic text-orange-600 dark:text-orange-400">Ghi chú: {order.note}</p>}
                            </div>
                            <button className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-white text-primary dark:bg-slate-800" onClick={() => window.open(`https://maps.google.com/?q=${order.customer?.latitude},${order.customer?.longitude}`)}>
                                <span className="material-symbols-outlined">map</span>
                            </button>
                        </div>
                    </section>

                    {/* Restaurant Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="mb-3 flex items-center justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 font-bold text-primary">
                                <span className="material-symbols-outlined">store</span> Nhà hàng
                            </h3>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 flex gap-3">
                                {order.restaurant?.logoBase64 && (
                                    <img src={order.restaurant?.logoBase64} alt={order.restaurant?.name} className="w-12 h-12 object-cover rounded shadow border" />
                                )}
                                <div>
                                    <p className="font-bold">{order.restaurant?.name}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-sm font-bold text-primary">
                                <span className="material-symbols-outlined text-sm">directions</span>
                                Chỉ đường
                            </button>
                        </div>
                    </section>

                    {/* Order List Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="mb-3 border-b border-slate-50 pb-2 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 font-bold text-primary">
                                <span className="material-symbols-outlined">restaurant_menu</span> Chi tiết món ăn
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.productName}</p>
                                        <p className="text-sm text-slate-500">Số lượng: {item.quantity}</p>
                                        {item.note && <p className="text-xs text-orange-500 mt-1 italic">Ghi chú: {item.note}</p>}
                                    </div>
                                    <p className="font-bold text-slate-700 dark:text-slate-300">
                                        {/* API chi tiết có thể không trả giá món ăn lẻ - nếu không có ẩn đi */}
                                        {item.price ? formatCurrency(item.price * item.quantity) : ''}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t border-dashed border-slate-200 pt-4 dark:border-slate-700">
                            <div className="mt-2 flex justify-between text-lg font-bold text-primary">
                                <span>TỔNG CỘNG</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
                                <span>Hình thức/Trạng thái:</span>
                                <span>{order.paymentMethod} - {getPaymentStatusLabel(order.paymentStatus)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Timeline Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="mb-4 font-bold">Trạng thái: <span className="text-primary">{getStatusLabel(order.status)}</span></h3>
                        <div className="relative space-y-6 pl-6">
                            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 size-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-primary">Lúc đặt</p>
                                    <p className="text-xs text-slate-400">{formatTime(order.createdAt)}</p>
                                </div>
                            </div>
                            {/* Detailed dynamic timeline depends on statusHistory. Here placeholder. */}
                        </div>
                    </section>
                    <div className="h-24"></div>
                </main>

                {/* Bottom Action Area */}
                {['DELIVERING', 'PENDING' /* Nếu shipper có thể tự pick */].includes(order.status) && (
                    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:relative md:bg-transparent md:dark:bg-transparent">
                        <div className="mx-auto flex max-w-[640px] gap-2">
                            <button 
                                onClick={() => setShowFailModal(true)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-100 bg-slate-50 py-3 font-bold text-red-500 dark:border-slate-800 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
                                <span className="material-symbols-outlined">cancel</span>
                                Thất bại
                            </button>
                            <button 
                                onClick={order.status === 'PENDING' ? handlePickedUp : handleDelivered}
                                className="flex-[2] rounded-xl bg-primary py-3 font-bold text-slate-900 shadow-lg shadow-primary/30 transition-transform active:scale-95"
                            >
                                {order.status === 'PENDING' ? 'Xác nhận Lấy hàng' : 'Xác nhận Giao hàng'}
                            </button>
                        </div>
                    </footer>
                )}

                {/* Failure Modal */}
                {showFailModal && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 md:items-center md:p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-[480px] rounded-t-3xl bg-white p-6 dark:bg-slate-900 md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Lý do giao thất bại?</h2>
                                <button onClick={() => setShowFailModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 transition-colors">close</button>
                            </div>
                            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                                {['Khách vắng nhà', 'Sai địa chỉ', 'Không liên lạc được', 'Khách từ chối nhận', 'Xe hỏng hóc/Sự cố', 'Khác'].map((reason) => (
                                    <label key={reason} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 transition-all hover:border-primary dark:border-slate-800">
                                        <span className="font-medium">{reason}</span>
                                        <input 
                                            className="h-5 w-5 border-slate-300 text-primary focus:ring-primary" 
                                            name="reason" 
                                            type="radio" 
                                            checked={failReason === reason}
                                            onChange={() => setFailReason(reason)}
                                        />
                                    </label>
                                ))}
                            </div>
                            <div className="mt-4">
                                <textarea 
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 outline-none" 
                                    placeholder="Nhập ghi chú chi tiết..." 
                                    rows="3"
                                    value={failNote}
                                    onChange={(e) => setFailNote(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button onClick={() => setShowFailModal(false)} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Hủy</button>
                                <button onClick={handleFailSubmit} className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">Yêu cầu Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailShipperPage;


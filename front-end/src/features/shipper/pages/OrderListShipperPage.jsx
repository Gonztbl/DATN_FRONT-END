import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';
import shipperService from '../api/shipperApi';
import Swal from 'sweetalert2';

const OrderListShipperPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PENDING');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'PENDING', label: 'Chờ nhận', icon: 'notifications_active' },
        { id: 'DELIVERING', label: 'Đang giao', icon: 'motorcycle' },
        { id: 'COMPLETED', label: 'Đã giao', icon: 'check_circle' },
        { id: 'FAILED', label: 'Thất bại', icon: 'cancel' }
    ];

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Mapping status to API needs depending on your backend
            const res = await shipperService.getOrders({ status: activeTab, limit: 100 });
            if (res.data && res.data.data) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const handleAcceptOrder = async (orderId) => {
        try {
            await shipperService.acceptOrder(orderId);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Nhận đơn hàng thành công!',
                timer: 1500,
                showConfirmButton: false
            });
            fetchOrders();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: 'Không thể nhận đơn hàng này',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-200">Chờ nhận</span>;
            case 'DELIVERING': return <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">Đang giao</span>;
            case 'COMPLETED': return <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">Đã giao</span>;
            case 'FAILED': return <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-200">Thất bại</span>;
            default: return null;
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

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="flex h-full grow flex-col">
                {/* Header Section */}
                <HeaderShipper title="Đơn hàng của tôi" />

                {/* Status Tabs */}
                <nav className="sticky top-[73px] z-40 bg-white dark:bg-slate-900 px-4 shadow-sm">
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center border-b-2 px-4 py-3 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                <span className="text-xs font-semibold mt-1 whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Order List */}
                <main className="flex-1 p-4 max-w-4xl mx-auto w-full mb-20">
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 block">inbox</span>
                                <p className="text-slate-500 dark:text-slate-400">Không có đơn hàng nào</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-4 transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">#{order.orderCode || order.id}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span>{formatTime(order.createdAt)}</span>
                                            </div>
                                        </div>
                                        {getStatusBadge(order.status || activeTab)}
                                    </div>

                                    {activeTab === 'COMPLETED' ? (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Đơn hàng hoàn tất vào lúc {formatTime(order.updatedAt || order.createdAt)}</p>
                                    ) : (
                                        <>
                                            <div className="mb-4 space-y-2 border-t border-b border-slate-50 dark:border-slate-800 py-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-slate-400 mt-0.5">person</span>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{order.customerName}</p>
                                                        <p className="text-sm text-slate-500">{order.customerPhone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-slate-400 mt-0.5">location_on</span>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{order.deliveryAddress}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tổng cộng</p>
                                                    <p className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                                                </div>
                                                <button 
                                                    onClick={() => activeTab === 'PENDING' ? handleAcceptOrder(order.id) : navigate(`/shipper/orders/${order.id}`)}
                                                    className={`flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold transition-transform active:scale-95 ${activeTab === 'PENDING' ? 'bg-primary text-slate-900 shadow-sm' : 'border-2 border-primary bg-transparent text-slate-900 dark:text-primary hover:bg-primary/10'}`}
                                                >
                                                    {activeTab === 'PENDING' ? 'Nhận đơn' : 'Chi tiết'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>

                {/* Bottom Navigation */}
                <footer className="fixed bottom-0 w-full z-50 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 flex justify-between items-center z-50">
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
                        onClick={() => navigate('/shipper/dashboard')}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-[10px] font-bold uppercase">Tổng quan</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-primary"
                        onClick={() => navigate('/shipper/orders')}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold uppercase">Đơn hàng</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
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

export default OrderListShipperPage;


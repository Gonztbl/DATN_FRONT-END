import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';
import merchantOrderService from '../api/merchantOrderService';
import { useRestaurant } from '../context/RestaurantContext';
import Swal from 'sweetalert2';

const MerchantOrderPage = () => {
    const navigate = useNavigate();
    const { error: contextError } = useRestaurant();
    const [activeTab, setActiveTab] = useState('PENDING');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const tabs = [
        { name: "Chờ duyệt", value: 'PENDING' },
        { name: "Đã xác nhận", value: 'CONFIRMED' },
        { name: "Sẵn sàng", value: 'READY_FOR_PICKUP' },
        { name: "Đang giao", value: 'DELIVERING' },
        { name: "Hoàn tất", value: 'COMPLETED' },
        { name: "Đã hủy", value: 'CANCELLED' }
    ];

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            // API expects 1-based page
            const res = await merchantOrderService.getOrders({
                page: page + 1,
                limit: size,
                status: activeTab
            });

            // According to provided API report:
            // Response has { data: [...], pagination: { totalEntries, totalPages, ... } }
            if (res.data && res.data.data) {
                setOrders(res.data.data);
                if (res.data.pagination) {
                    setTotalPages(res.data.pagination.totalPages || 1);
                    setTotalElements(res.data.pagination.total || res.data.data.length);
                }
            } else if (res.data && res.data.content) {
                // Fallback for previous structure just in case
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages || 1);
                setTotalElements(res.data.totalElements || res.data.content.length);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, size]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleTabChange = (tabValue) => {
        setActiveTab(tabValue);
        setPage(0); // Reset page directly to avoid multiple useEffect triggers
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'READY_FOR_PICKUP': return 'bg-primary/20 text-slate-900 dark:text-slate-100 font-bold';
            case 'DELIVERING': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'CANCELLED': 
            case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ duyệt';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'READY_FOR_PICKUP': return 'Sẵn sàng';
            case 'DELIVERING': return 'Đang giao';
            case 'COMPLETED': return 'Hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            case 'FAILED': return 'Thất bại';
            default: return status || 'N/A';
        }
    };

    const formatCurrency = (amount) => {
        if (amount == null) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('vi-VN');
    };

    const handleConfirm = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await merchantOrderService.confirmOrder(id);
            Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã xác nhận đơn hàng', timer: 1500, showConfirmButton: false });
            fetchOrders();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xác nhận đơn hàng' });
        }
    };

    const handleReady = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await merchantOrderService.markOrderReady(id);
            Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã báo món sẵn sàng', timer: 1500, showConfirmButton: false });
            fetchOrders();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật trạng thái' });
        }
    };

    const handleReject = async (id, e) => {
        if (e) e.stopPropagation();
        const { value: reason } = await Swal.fire({
            title: 'Hủy đơn hàng?',
            input: 'textarea',
            inputLabel: 'Nhập lý do từ chối/hủy đơn',
            inputPlaceholder: 'Ví dụ: Hết món...',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận hủy',
            cancelButtonText: 'Đóng',
            confirmButtonColor: '#ef4444'
        });

        if (reason !== undefined) {
            try {
                await merchantOrderService.rejectOrder(id, { reason });
                Swal.fire({ icon: 'success', title: 'Đã hủy', text: 'Đơn hàng đã bị hủy thành công', timer: 1500, showConfirmButton: false });
                fetchOrders();
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể hủy đơn hàng lúc này' });
            }
        }
    };
    
    // Pagination controls
    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

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
                <HeaderRestaurant title="Quản lý đơn hàng" />

                <div className="p-8 flex flex-col gap-6">
                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black leading-tight tracking-tight">Danh sách đơn hàng</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Theo dõi và quản lý luồng nhận đơn hàng của bạn.</p>
                        </div>
                        <button className="bg-primary text-background-dark font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined">refresh</span>
                            Làm mới
                        </button>
                    </div>

                    {/* Status Tabs */}
                    <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                        <div className="flex gap-8 min-w-max">
                            {tabs.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)}
                                    className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-all ${activeTab === tab.value ? 'border-primary text-slate-900 dark:text-slate-100 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                                >
                                    <p className="text-sm font-bold">{tab.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative h-12 w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="block w-full h-full pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary text-sm outline-none" placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..." type="text" />
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto min-h-[300px]">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                                    <p className="text-slate-500 font-medium text-sm">Đang tải dữ liệu đơn hàng...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-20">
                                    <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 block mb-4">receipt_long</span>
                                    <p className="text-slate-500 font-medium">Không tìm thấy đơn hàng nào ở trạng thái này</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4">Mã đơn</th>
                                            <th className="px-6 py-4">Thời gian</th>
                                            <th className="px-6 py-4">Khách hàng</th>
                                            <th className="px-6 py-4">Sản phẩm</th>
                                            <th className="px-6 py-4">Tổng tiền</th>
                                            <th className="px-6 py-4">Trạng thái</th>
                                            <th className="px-6 py-4 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {orders.map((order) => {
                                            const itemsString = order.orderItems?.map(i => `${i.quantity}x ${i.productName}`).join(', ');
                                            return (
                                                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 font-mono font-bold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/merchant/orders/${order.id}`)}>
                                                        #{order.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                        {formatTime(order.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{order.recipientName}</span>
                                                            <span className="text-xs text-slate-500 mt-1">{order.paymentMethod || 'SmartPay'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm max-w-[200px] truncate text-slate-700 dark:text-slate-300" title={itemsString}>
                                                        {itemsString || 'Trống'}
                                                    </td>
                                                    <td className="px-6 py-4 font-black tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
                                                        {formatCurrency(order.totalAmount)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyles(order.status)}`}>
                                                            {getStatusLabel(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {order.status === 'PENDING' ? (
                                                                <>
                                                                    <button onClick={(e) => handleConfirm(order.id, e)} className="bg-primary text-background-dark text-xs font-bold px-4 py-2 rounded-lg hover:brightness-105 active:scale-95 transition-all shadow-sm">
                                                                        Xác nhận
                                                                    </button>
                                                                    <button onClick={(e) => handleReject(order.id, e)} className="border border-red-500 text-red-500 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-95 transition-all">
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            ) : order.status === 'CONFIRMED' ? (
                                                                <button onClick={(e) => handleReady(order.id, e)} className="bg-primary/20 text-slate-900 dark:text-slate-100 border border-primary/50 text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/30 active:scale-95 transition-all shadow-sm">
                                                                    Báo Món Sẵn Sàng
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => navigate(`/merchant/orders/${order.id}`)} className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Xem chi tiết">
                                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        {/* Pagination */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-700 dark:text-slate-300">{orders.length > 0 ? page * size + 1 : 0}</span> đến <span className="font-bold text-slate-700 dark:text-slate-300">{page * size + orders.length}</span> trong số <span className="font-bold text-slate-700 dark:text-slate-300">{totalElements}</span> đơn hàng
                            </p>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(page - 1)} disabled={!canPrev} className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                                    <span className="material-symbols-outlined text-[20px] block">chevron_left</span>
                                </button>
                                <button onClick={() => setPage(page + 1)} disabled={!canNext} className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                                    <span className="material-symbols-outlined text-[20px] block">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantOrderPage;

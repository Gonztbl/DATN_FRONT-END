import React, { useState, useEffect, useCallback } from 'react';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import adminOrderService from '../api/adminOrderService';
import restaurantService from '../api/restaurantService';
import { useNotification } from '../../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListOrderAdmin = () => {
    const navigate = useNavigate();
    const { showError, showSuccess } = useNotification();
    
    // State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // API uses 0-based for orders
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [restaurantsMap, setRestaurantsMap] = useState({});
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [shippersMap, setShippersMap] = useState({});
    const [shippersList, setShippersList] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const [selectedShipperId, setSelectedShipperId] = useState('');
    const [loadingFilters, setLoadingFilters] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: page,
                size: 10,
                status: statusFilter === 'ALL' ? undefined : statusFilter,
                restaurantId: selectedRestaurantId || undefined,
                shipperId: selectedShipperId || undefined,
                search: debouncedSearchTerm || undefined,
                fromDate: startDate || undefined,
                toDate: endDate || undefined,
                sortBy: 'createdAt',
                sortDir: 'desc'
            };
            
            const response = await adminOrderService.getAllOrders(params);
            if (response && response.data) {
                // Adjust this mapping based on actual API response structure (Page object or Array)
                const data = response.data.content || response.data || [];
                console.log("Admin Orders Data:", data); // Debugging data structure
                setOrders(data);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || (response.data.content ? response.data.content.length : 0));
            }
        } catch (error) {
            console.error("Error fetching admin orders:", error);
            showError("Có lỗi xảy ra khi tải danh sách đơn hàng toàn hệ thống.");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, debouncedSearchTerm, startDate, endDate, selectedRestaurantId, selectedShipperId, showError]);

    const fetchRestaurantsMapping = useCallback(async () => {
        try {
            // Fetch a larger set to cover most active restaurants
            const response = await restaurantService.getRestaurants({ page: 0, size: 500 });
            
            const extractList = (res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res;
                if (res.content && Array.isArray(res.content)) return res.content;
                if (res.data && Array.isArray(res.data)) return res.data;
                if (res.data && res.data.content && Array.isArray(res.data.content)) return res.data.content;
                return [];
            };

            const contents = extractList(response);
            setRestaurantsList(contents);
            
            const mapping = {};
            contents.forEach(r => {
                const id = r.id || r.restaurantId;
                const name = r.name || r.restaurantName;
                if (id && name) mapping[id] = name;
            });
            setRestaurantsMap(mapping);
            console.log("Restaurants mapping updated:", Object.keys(mapping).length, "items", mapping);
        } catch (error) {
            console.error("Error fetching restaurants for mapping:", error);
        }
    }, []);

    const handleDeleteOrder = async (id) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: `Bạn có chắc chắn muốn xóa đơn hàng #${id}? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await adminOrderService.deleteOrder(id);
                showSuccess(`Đã xóa thành công đơn hàng #${id}`);
                fetchOrders(); // Refresh list
            } catch (error) {
                console.error("Error deleting order:", error);
                showError("Không thể xóa đơn hàng. Vui lòng thử lại sau.");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchInput);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchShippersList = useCallback(async () => {
        try {
            const response = await adminOrderService.getShippers({ page: 0, size: 200 });
            const shippers = response.data?.content || [];
            setShippersList(shippers);
            
            // Also update shippersMap for the table
            setShippersMap(prev => {
                const mapping = { ...prev };
                shippers.forEach(s => {
                    mapping[s.id] = s.fullName || s.userName;
                });
                return mapping;
            });
            
        } catch (error) {
            console.error("Error fetching shippers list:", error);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        const initFilters = async () => {
            setLoadingFilters(true);
            await Promise.all([
                fetchRestaurantsMapping(),
                fetchShippersList()
            ]);
            setLoadingFilters(false);
        };
        initFilters();
    }, [fetchRestaurantsMapping, fetchShippersList]);

    useEffect(() => {
        const fetchShippersDetails = async () => {
            const missingIds = orders
                .map(o => o.shipperId)
                .filter(id => id != null && shippersMap[id] === undefined);
            
            const uniqueMissingIds = [...new Set(missingIds)];
            
            if (uniqueMissingIds.length === 0) return;

            const newMappings = {};
            let hasNew = false;
            for (const id of uniqueMissingIds) {
                try {
                    const response = await adminOrderService.getShipperDetail(id);
                    newMappings[id] = response.data?.fullName || response.data?.userName || `Shipper #${id}`;
                    hasNew = true;
                } catch (error) {
                    console.error(`Error fetching shipper detail for ID ${id}:`, error);
                    newMappings[id] = `Shipper #${id}`;
                    hasNew = true;
                }
            }
            
            if (hasNew) {
                setShippersMap(prev => ({ ...prev, ...newMappings }));
            }
        };

        if (orders.length > 0) {
            fetchShippersDetails();
        }
    }, [orders]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'PREPARING': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'DELIVERING': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'CANCELLED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            case 'DELIVERY_FAILED': return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getOrderRestaurant = (order) => {
        const items = order.items || order.orderItems || [];
        const resId = order.restaurantId || 
                     order.restaurant?.id || 
                     order.merchantId || 
                     order.merchant?.id || 
                     order.vendorId || 
                     order.storeId ||
                     items[0]?.restaurantId ||
                     items[0]?.merchantId ||
                     items[0]?.product?.restaurantId;
        
        return order.restaurantName || 
               order.restaurant?.name || 
               order.restaurant?.restaurantName ||
               order.merchantName ||
               order.merchant?.name ||
               order.storeName ||
               order.store?.name ||
               (resId ? restaurantsMap[resId] : null) ||
               items[0]?.restaurantName ||
               items[0]?.merchantName ||
               items[0]?.product?.restaurant?.name ||
               (resId ? `Nhà hàng #${resId}` : 'N/A');
    };

    const getOrderShipper = (order) => {
        const sId = order.shipperId || order.shipper?.id;
        if (!sId) return "Chưa có shipper nhận đơn";
        
        return order.shipperName || 
               order.shipper?.fullName || 
               shippersMap[sId] || 
               `Shipper #${sId}`;
    };

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(0);
    };

    const filteredOrders = orders.filter(order => {
        if (!debouncedSearchTerm) return true;
        const search = debouncedSearchTerm.toLowerCase();
        return (
            order.id.toString().includes(search) ||
            order.recipientName?.toLowerCase().includes(search) ||
            order.recipientPhone?.includes(search) ||
            order.userName?.toLowerCase().includes(search) ||
            order.fullName?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-screen flex font-display transition-colors duration-300">
            <SidebarAdmin />

            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-y-auto w-full">
                <HeaderAdmin title="Quản lý đơn hàng" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                        
                        {/* Toolbar & Filters */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Search */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block tracking-wider">Tìm kiếm nhanh</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">search</span>
                                        <input 
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary focus:border-primary transition-colors" 
                                            placeholder="Mã đơn, Khách hàng, SĐT..." 
                                            type="text"
                                            value={searchInput}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </div>
                                {/* Date Range */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block tracking-wider">Thời gian (Từ ngày - Đến ngày)</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <input 
                                                className="w-full pl-4 pr-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-colors" 
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <span className="text-slate-400 dark:text-slate-600">đến</span>
                                        <div className="relative flex-1">
                                            <input 
                                                className="w-full pl-4 pr-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-colors" 
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block tracking-wider">Trạng thái</label>
                                    <select 
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-colors"
                                        value={statusFilter}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="ALL">Tất cả trạng thái</option>
                                        <option value="PENDING">ĐANG CHỜ</option>
                                        <option value="CONFIRMED">ĐÃ XÁC NHẬN</option>
                                        <option value="PREPARING">ĐANG CHUẨN BỊ</option>
                                        <option value="DELIVERING">ĐANG GIAO</option>
                                        <option value="COMPLETED">HOÀN THÀNH</option>
                                        <option value="CANCELLED">ĐÃ HỦY</option>
                                        <option value="DELIVERY_FAILED">GIAO THẤT BẠI</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block tracking-wider">Nhà hàng</label>
                                    <select 
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-colors"
                                        value={selectedRestaurantId}
                                        onChange={(e) => {
                                            setSelectedRestaurantId(e.target.value);
                                            setPage(0);
                                        }}
                                    >
                                        <option value="">Tất cả nhà hàng</option>
                                        {restaurantsList.map(res => (
                                            <option key={res.id} value={res.id}>
                                                {res.name || res.restaurantName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block tracking-wider">Shipper</label>
                                    <select 
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-colors"
                                        value={selectedShipperId}
                                        onChange={(e) => {
                                            setSelectedShipperId(e.target.value);
                                            setPage(0);
                                        }}
                                    >
                                        <option value="">Tất cả Shipper</option>
                                        {shippersList.map(shipper => (
                                            <option key={shipper.id} value={shipper.id}>
                                                {shipper.fullName || shipper.userName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mã đơn</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khách hàng</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nhà hàng</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shipper</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tổng tiền</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thời gian tạo</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 transition-colors">Đang tải danh sách đơn hàng...</td>
                                            </tr>
                                        ) : filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-6 py-4 text-sm font-bold text-primary">#{order.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="group/tooltip relative">
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{order.fullName || order.userName || 'Khách lẻ'}</p>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <span className="material-symbols-outlined text-[10px] text-slate-400 dark:text-slate-500">person</span>
                                                                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Người nhận: {order.recipientName}</p>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-3.5">{order.recipientPhone}</p>
                                                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block z-50 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-slate-700">
                                                                <p className="font-bold border-b border-slate-700 pb-1 mb-1">Địa chỉ giao hàng:</p>
                                                                {order.deliveryAddress}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                        {getOrderRestaurant(order)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`material-symbols-outlined text-sm ${order.shipperId ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
                                                                {order.shipperId ? 'local_shipping' : 'pending_actions'}
                                                            </span>
                                                            <span className={`text-sm font-medium ${order.shipperId ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 italic'}`}>
                                                                {getOrderShipper(order)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                                                            {order.status === 'PENDING' ? 'CHỜ XÁC NHẬN' :
                                                             order.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' :
                                                             order.status === 'PREPARING' ? 'ĐANG CHUẨN BỊ' :
                                                             order.status === 'DELIVERING' ? 'ĐANG GIAO' :
                                                             order.status === 'COMPLETED' ? 'HOÀN THÀNH' :
                                                             order.status === 'CANCELLED' ? 'ĐÃ HỦY' :
                                                             order.status === 'DELIVERY_FAILED' ? 'GIAO THẤT BẠI' : order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                                className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/20 hover:text-primary transition-colors" 
                                                                title="Xem chi tiết"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteOrder(order.id)}
                                                                className="size-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" 
                                                                title="Xóa đơn hàng"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">Không tìm thấy đơn hàng nào.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Hiển thị {page * 10 + 1}-{Math.min((page + 1) * 10, totalElements)} trên tổng số {totalElements} đơn hàng</p>
                                <div className="flex items-center gap-1">
                                    <button 
                                        disabled={page === 0}
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        className="size-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setPage(i)}
                                            className={`size-9 rounded-lg flex items-center justify-center font-bold text-sm ${page === i ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    )).slice(0, 5)} {/* Limit to first 5 pages for now */}
                                    <button 
                                        disabled={page === totalPages - 1}
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                        className="size-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ListOrderAdmin;

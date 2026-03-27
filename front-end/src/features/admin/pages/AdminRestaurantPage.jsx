import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import { useAuth } from '../../auth/context/AuthContext';
import { showSuccess, showError, showWarning, showConfirm } from '../../../utils/swalUtils';
import restaurantService from '../api/restaurantService';
import userManageService from '../api/userManageService';

const getSafeImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:image')) {
        return url.replace(/[\r\n\s]+/g, '');
    }
    return url;
};

export default function AdminRestaurantPage() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Data State
    const [restaurants, setRestaurants] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Filter State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'OPEN', 'CLOSED'

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        status: true,
        open_time: '08:00',
        close_time: '22:00',
        userId: ''
    });

    const fetchOwners = async () => {
        try {
            const allUsers = await userManageService.getAllUsers();
            if (allUsers && Array.isArray(allUsers)) {
                const restaurantOwners = allUsers.filter(u => u.role === 'RESTAURANT_OWNER');
                setOwners(restaurantOwners);
            }
        } catch (error) {
            console.error("Lỗi khi fetch users", error);
        }
    };


    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (searchQuery) params.search = searchQuery;
            if (statusFilter === 'OPEN') params.status = true;
            if (statusFilter === 'CLOSED') params.status = false;

            const response = await restaurantService.getRestaurants(params);

            if (response && response.data) {
                setRestaurants(response.data);
                if (response.pagination) {
                    setTotal(response.pagination.total);
                } else if (response.total) {
                    setTotal(response.total);
                } else {
                    setTotal(response.data.length);
                }
            } else if (response && response.content) {
                setRestaurants(response.content);
                setTotal(response.totalElements || response.content.length);
            } else if (Array.isArray(response)) {
                setRestaurants(response);
                setTotal(response.length);
            }
        } catch (error) {
            console.error("Lỗi khi fetch restaurants", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRestaurants();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [page, limit, searchQuery, statusFilter]);

    useEffect(() => {
        fetchOwners();
    }, []);


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Modal Actions
    const handleOpenAdd = () => {
        setEditingRestaurant(null);
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            status: true,
            open_time: '08:00',
            close_time: '22:00',
            userId: ''
        });
        setShowModal(true);
    };

    const handleOpenEdit = async (restaurant) => {
        try {
            const details = await restaurantService.getRestaurantDetail(restaurant.id).catch(() => restaurant);
            setEditingRestaurant(details);
            setFormData({
                name: details.name || '',
                phone: details.phone || '',
                email: details.email || '',
                address: details.address || '',
                status: details.status !== undefined ? details.status : true,
                open_time: details.open_time || '08:00',
                close_time: details.close_time || '22:00',
                userId: details.userId || details.ownerId || ''
            });
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRestaurant(null);
    };

    // Form Change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.userId) {
            showWarning("Missing Data", "Vui lòng nhập tên, địa chỉ và chọn chủ nhà hàng.");
            return;
        }


        if (!editingRestaurant || formData.name !== editingRestaurant.name) {
            try {
                const checkData = await restaurantService.checkRestaurantName(
                    formData.name,
                    editingRestaurant ? editingRestaurant.id : null
                );

                if (checkData && checkData.exists) {
                    showWarning("Duplicate Name", `Tên nhà hàng "${formData.name}" đã tồn tại!`);
                    return;
                }
            } catch (error) {
                console.warn("Không thể kiểm tra trùng lặp tên, tiếp tục lưu...", error);
            }
        }

        const payload = {
            ...formData
        };

        try {
            if (editingRestaurant) {
                await restaurantService.updateRestaurant(editingRestaurant.id, payload);
                showSuccess("Success", "Cập nhật nhà hàng thành công!");
            } else {
                await restaurantService.createRestaurant(payload);
                showSuccess("Success", "Thêm nhà hàng thành công!");
            }

            handleCloseModal();
            setPage(1);
            fetchRestaurants();
        } catch (error) {
            console.error(error);
            const errorMsg = typeof error.response?.data === 'string'
                ? error.response?.data
                : error.response?.data?.message || "Có lỗi xảy ra khi lưu trữ thông tin!";
            showError("Error", errorMsg);
        }
    };

    // Delete
    const handleDelete = async (id) => {
        const result = await showConfirm("Xác nhận xóa", "Bạn có chắc chắn muốn xóa nhà hàng này?");
        if (!result.isConfirmed) return;

        try {
            await restaurantService.deleteRestaurant(id);
            showSuccess("Success", "Xóa thành công!");
            fetchRestaurants();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Không thể xóa nhà hàng. Có thể nhà hàng này đang chứa sản phẩm.";
            showError("Error", errorMsg);
        }
    };

    // Export
    const handleExport = async () => {
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (statusFilter === 'OPEN') params.status = true;
            if (statusFilter === 'CLOSED') params.status = false;

            const blobData = await restaurantService.exportRestaurants(params);
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'restaurants-export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            showError("Lỗi", "Lỗi khi xuất dữ liệu.");
        }
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-x-hidden md:flex-row transition-colors duration-300">
            <SidebarAdmin />

            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
                <HeaderAdmin title="Restaurant Management" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Quản lý nhà hàng</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý danh sách, trạng thái và thực đơn của các đối tác</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                            >
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">download</span>
                                <span className="font-bold text-sm">Xuất dữ liệu</span>
                            </button>
                            <button
                                onClick={handleOpenAdd}
                                className="flex items-center gap-2 bg-primary text-slate-950 px-6 py-3 rounded-xl font-bold hover:brightness-105 shadow-lg shadow-primary/20 transition-all h-12"
                            >
                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                <span>Thêm nhà hàng</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <button
                                onClick={() => setStatusFilter('ALL')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === 'ALL' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setStatusFilter('OPEN')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === 'OPEN' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                Đang mở
                            </button>
                            <button
                                onClick={() => setStatusFilter('CLOSED')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === 'CLOSED' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                Đóng cửa
                            </button>
                        </div>
                        <div className="relative w-full lg:w-96 flex">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm auto-cols-max">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tên nhà hàng</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Địa chỉ</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Số món</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</td>
                                        </tr>
                                    ) : restaurants.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">Không tìm thấy nhà hàng nào.</td>
                                        </tr>
                                    ) : (
                                        restaurants.map(rs => (
                                            <tr key={rs.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{rs.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {rs.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] xl:max-w-[300px] truncate" title={rs.address}>
                                                        {rs.address}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300">
                                                        {rs.product_count || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rs.status ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                                            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                                            Đang mở
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/40">
                                                            <span className="size-1.5 rounded-full bg-red-500"></span>
                                                            Đóng cửa
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenEdit(rs)}
                                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors material-symbols-outlined"
                                                            title="Chỉnh sửa"
                                                        >
                                                            edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(rs.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors material-symbols-outlined"
                                                            title="Xóa"
                                                        >
                                                            delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Hiển thị {total > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, total)} trong tổng số {total} nhà hàng
                            </span>
                            <div className="flex gap-1">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                                >
                                    Trang trước
                                </button>

                                {[...Array(totalPages)].map((_, idx) => {
                                    const p = idx + 1;
                                    // Hiển thị một số trang gần trang hiện tại để tránh quá dài, logic đơn giản cho demo
                                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${page === p ? 'bg-primary text-background-dark font-bold shadow-sm border-transparent' : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    } else if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="px-1 py-1.5 text-xs text-slate-500">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    disabled={page === totalPages || totalPages === 0}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                    <span className="material-symbols-outlined text-2xl">restaurant</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                        {editingRestaurant ? 'Cập nhật nhà hàng' : 'Thêm nhà hàng mới'}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {editingRestaurant ? 'Chỉnh sửa thông tin đối tác' : 'Nhập thông tin cơ bản cho nhà hàng đối tác'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors material-symbols-outlined text-slate-400 outline-none">
                                close
                            </button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <form className="space-y-6" id="restaurant-form" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tên nhà hàng <span className="text-red-500">*</span></label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                placeholder="VD: Phở Thìn Lò Đúc"
                                                type="text"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Số điện thoại</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                placeholder="024 3971 2738"
                                                type="tel"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email liên hệ</label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                placeholder="contact@phothin.com"
                                                type="email"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Chủ nhà hàng <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    name="userId"
                                                    value={formData.userId}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm outline-none appearance-none transition-all"
                                                >
                                                    <option value="" className="dark:bg-slate-900">-- Chọn chủ nhà hàng --</option>
                                                    {owners.map(owner => (
                                                        <option key={owner.id} value={owner.id} className="dark:bg-slate-900">
                                                            {owner.fullName || owner.userName} (ID: {owner.id})
                                                        </option>
                                                    ))}
                                                </select>
                                                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Giờ mở cửa</label>
                                                <input
                                                    name="open_time"
                                                    value={formData.open_time}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm outline-none transition-all"
                                                    type="time"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Giờ đóng cửa</label>
                                                <input
                                                    name="close_time"
                                                    value={formData.close_time}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm outline-none transition-all"
                                                    type="time"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Trạng thái hiện tại</label>
                                            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                                                    {formData.status ? 'Đang mở cửa' : 'Đóng cửa'}
                                                </span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="status"
                                                        className="sr-only peer"
                                                        checked={formData.status}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Width: Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none outline-none custom-scrollbar transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors outline-none font-display">
                                Hủy bỏ
                            </button>
                            <button form="restaurant-form" type="submit" className="px-8 py-2.5 rounded-xl text-sm font-bold bg-primary text-slate-950 shadow-lg shadow-primary/20 hover:brightness-105 transition-all outline-none font-display">
                                Lưu thông tin
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import { useAuth } from '../../auth/context/AuthContext';
import vendorService from '../api/vendorService';
import { showSuccess, showError, showWarning, showConfirm } from '../../../utils/swalUtils';

export default function VendorManagerPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Data State
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Filter State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        orderIndex: 1
    });

    // Các icon khả dụng để chọn
    const availableIcons = [
        'devices', 'apparel', 'home', 'health_and_safety', 'restaurant',
        'toys', 'sports_esports', 'book', 'pets', 'fitness_center', 'more_horiz'
    ];

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (searchQuery) params.search = searchQuery;

            const data = await vendorService.getCategories(params);
            // Giả định backend trả về { content: [], totalElements: number }
            if (data && data.content !== undefined) {
                setCategories(data.content);
                setTotal(data.totalElements || data.content.length);
            } else if (data && data.data) {
                setCategories(data.data);
                setTotal(data.total || data.data.length);
            } else if (Array.isArray(data)) {
                setCategories(data);
                setTotal(data.length);
            }
        } catch (error) {
            console.error("Lỗi khi fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu khi mount / thay đổi filter
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCategories();
        }, 300); // debounce search

        return () => clearTimeout(timeoutId);
    }, [page, limit, searchQuery]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Mở Modal Thêm mới
    const handleOpenAdd = () => {
        setEditingCategory(null);
        setFormData({ name: '', icon: availableIcons[0], orderIndex: categories.length + 1 });
        setShowModal(true);
    };

    // Mở Modal Sửa
    const handleOpenEdit = async (cat) => {
        try {
            // Có thể dùng luôn data ở bảng hoặc fetch chi tiết
            const details = await vendorService.getCategory(cat.id).catch(() => cat);
            setEditingCategory(details);
            setFormData({
                name: details.name || '',
                icon: details.icon || availableIcons[0],
                orderIndex: details.orderIndex || 1
            });
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    // Đóng Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    // Change input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'orderIndex' ? Number(value) : value }));
    };

    // Chọn icon
    const handleSelectIcon = (iconStr) => {
        setFormData(prev => ({ ...prev, icon: iconStr }));
    };

    // Submit form thêm/sửa
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            showWarning("Missing Name", "Vui lòng nhập tên danh mục");
            return;
        }

        if (!editingCategory || formData.name !== editingCategory.name) {
            try {
                // Kiểm tra tên danh mục trước khi lưu
                const checkData = await vendorService.checkCategoryName(
                    formData.name,
                    editingCategory ? editingCategory.id : null
                );

                const isDuplicate = checkData && checkData.exists;

                if (isDuplicate) {
                    showWarning("Duplicate Name", `Tên danh mục "${formData.name}" đã tồn tại!`);
                    return;
                }
            } catch (error) {
                console.warn("Không thể kiểm tra trùng lặp tên danh mục, tiếp tục lưu...", error);
            }
        }

        const payload = {
            name: formData.name,
            icon: formData.icon,
            orderIndex: Number(formData.orderIndex) || 1
        };

        try {
            if (editingCategory) {
                await vendorService.updateCategory(editingCategory.id, payload);
                showSuccess("Success", "Cập nhật danh mục thành công!");
            } else {
                await vendorService.createCategory(payload);
                showSuccess("Success", "Thêm danh mục thành công!");
            }

            // Reload list
            handleCloseModal();
            setPage(1);
            fetchCategories();
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            showError("Error", errorMsg);
        }
    };

    // Xoá danh mục
    const handleDelete = async (id) => {
        const result = await showConfirm("Xác nhận xóa", "Bạn có chắc chắn muốn xóa danh mục này?");
        if (!result.isConfirmed) return;

        try {
            await vendorService.deleteCategory(id);
            showSuccess("Success", "Xóa thành công!");
            fetchCategories();
        } catch (error) {
            console.error(error);
            showError("Lỗi", "Không thể xóa danh mục. Có thể danh mục này đang chứa sản phẩm.");
        }
    };

    // Xuất dữ liệu
    const handleExport = async () => {
        try {
            const blobData = await vendorService.exportCategories();
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'categories-export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            showError("Lỗi", "Lỗi khi xuất dữ liệu.");
        }
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <SidebarAdmin />

            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
                <HeaderAdmin title="Category Management" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                        {/* Page Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Quản lý danh mục</h1>
                                <p className="text-slate-500 text-sm">Quản lý các nhóm sản phẩm và phân loại dịch vụ.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/admin/restaurant-manager')}
                                    className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined">restaurant</span>
                                    <span>Quản lý Nhà hàng</span>
                                </button>
                                <button
                                    onClick={handleOpenAdd}
                                    className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                                >
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span>Thêm danh mục</span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                            <div className="w-full md:flex-1">
                                <label className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 h-12 border border-slate-200 dark:border-slate-700 focus-within:border-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                    <input
                                        className="bg-transparent border-none focus:ring-0 text-base w-full placeholder:text-slate-400 ml-2 outline-none text-slate-900 dark:text-slate-100"
                                        placeholder="Tìm kiếm theo tên danh mục, mã danh mục..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined text-slate-500">filter_list</span>
                                    <span className="font-medium">Bộ lọc</span>
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-slate-500">download</span>
                                    <span className="font-medium">Xuất dữ liệu</span>
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Biểu tượng</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tên danh mục</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Thứ tự</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Số lượng SP</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                                            </tr>
                                        ) : categories.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Không tìm thấy danh mục nào.</td>
                                            </tr>
                                        ) : (
                                            categories.map(cat => (
                                                <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                            <span className="material-symbols-outlined">{cat.icon || 'category'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</div>
                                                        <div className="text-xs text-slate-500">ID: {cat.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">{cat.orderIndex || 1}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                            {cat.products_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleOpenEdit(cat)}
                                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <span className="material-symbols-outlined text-xl">edit_square</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cat.id)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                                title="Xóa"
                                                            >
                                                                <span className="material-symbols-outlined text-xl">delete</span>
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
                            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="text-sm text-slate-500">
                                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong {total} danh mục
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        className="size-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const p = idx + 1;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium ${page === p
                                                    ? 'bg-primary text-slate-900 font-bold'
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                    <button
                                        disabled={page === totalPages || totalPages === 0}
                                        onClick={() => setPage(page + 1)}
                                        className="size-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal Form Thêm/Sửa */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-transform">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tên danh mục</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 outline-none text-slate-900 dark:text-slate-100"
                                    placeholder="VD: Đồ chơi trẻ em"
                                    type="text"
                                />
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Chọn biểu tượng</label>
                                <div className="grid grid-cols-6 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    {availableIcons.map(iconStr => (
                                        <button
                                            key={iconStr}
                                            type="button"
                                            onClick={() => handleSelectIcon(iconStr)}
                                            className={`size-10 rounded-lg flex items-center justify-center transition-all ${formData.icon === iconStr
                                                ? 'bg-white dark:bg-slate-700 border border-primary text-primary shadow-sm ring-2 ring-primary/20'
                                                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">{iconStr}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Biểu tượng sẽ hiển thị tại trang khách hàng.</p>
                            </div>

                            {/* orderIndex Field */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Thứ tự hiển thị</label>
                                <div className="relative max-w-[120px]">
                                    <input
                                        name="orderIndex"
                                        type="number"
                                        value={formData.orderIndex}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                <button onClick={handleCloseModal} className="px-6 h-12 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" type="button">Hủy</button>
                                <button className="px-8 h-12 rounded-xl bg-primary text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all" type="submit">
                                    {editingCategory ? "Cập nhật" : "Lưu danh mục"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

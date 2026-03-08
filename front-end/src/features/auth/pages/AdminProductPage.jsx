import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../../components/common/SidebarAdmin';
import productService from '../../../services/productService';
import vendorService from '../../../services/vendorService';
import restaurantService from '../../../services/restaurantService';

const getSafeImageUrl = (imgData) => {
    if (!imgData) return '';
    const cleanStr = typeof imgData === 'string' ? imgData.replace(/[\r\n\s]+/g, '') : '';
    if (cleanStr.startsWith('http') || cleanStr.startsWith('/')) return cleanStr;
    if (cleanStr.startsWith('data:image')) return cleanStr;
    if (cleanStr) return `data:image/jpeg;base64,${cleanStr}`;
    return '';
};

export default function AdminProductPage() {
    // Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Filter State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        restaurant_id: '',
        status: 'available',
        image_base64: ''
    });
    const [imagePreview, setImagePreview] = useState('');

    // Fetch initial dropdown data
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const extractList = (res) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (Array.isArray(res.content)) return res.content;
                    if (Array.isArray(res.data)) return res.data;
                    if (res.data && Array.isArray(res.data.content)) return res.data.content;
                    return [];
                };

                // Fetch categories
                const catRes = await vendorService.getCategories({ limit: 100, size: 100 });
                setCategories(extractList(catRes));

                // Fetch restaurants
                const restRes = await restaurantService.getRestaurants({ limit: 100, size: 100 });
                setRestaurants(extractList(restRes));
            } catch (error) {
                console.error("Error fetching dependencies", error);
            }
        };
        fetchDropdowns();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (searchQuery) params.search = searchQuery;
            if (categoryId) params.category_id = categoryId;
            if (restaurantId) params.restaurant_id = restaurantId;
            if (statusFilter) params.status = statusFilter;

            const response = await productService.getProducts(params);

            if (response && response.content !== undefined) {
                setProducts(response.content);
                setTotal(response.totalElements || response.content.length);
            } else if (response && response.data) {
                setProducts(response.data);
                if (response.pagination) {
                    setTotal(response.pagination.total);
                } else {
                    setTotal(response.total || response.data.length);
                }
            } else if (Array.isArray(response)) {
                setProducts(response);
                setTotal(response.length);
            }
        } catch (error) {
            console.error("Lỗi khi fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [page, limit, searchQuery, categoryId, restaurantId, statusFilter]);

    // Form Handlers
    const handleOpenAdd = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            restaurant_id: restaurants.length > 0 ? restaurants[0].id : '',
            status: 'available',
            image_base64: ''
        });
        setImagePreview('');
        setShowModal(true);
    };

    const handleOpenEdit = async (product) => {
        try {
            const details = await productService.getProductDetail(product.id).catch(() => product);
            setEditingProduct(details);
            setFormData({
                name: details.name || '',
                description: details.description || '',
                price: details.price || '',
                category_id: details.category?.id || details.category_id || '',
                restaurant_id: details.restaurant?.id || details.restaurant_id || '',
                status: details.status || 'available',
                image_base64: details.image_base64 || details.imageBase64 || ''
            });
            setImagePreview(details.image_base64 || details.imageBase64 || '');
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleOpenView = async (product) => {
        try {
            // Fetch detailed info to get description, etc., if not bundled
            const details = await productService.getProductDetail(product.id).catch(() => product);
            setViewingProduct(details);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseView = () => {
        setViewingProduct(null);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Kích thước ảnh không được vượt quá 2MB");
                e.target.value = '';
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP");
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image_base64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category_id || !formData.restaurant_id) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        const payload = {
            ...formData,
            category_id: Number(formData.category_id) || formData.category_id,
            categoryId: Number(formData.category_id) || formData.category_id,
            restaurant_id: formData.restaurant_id,
            restaurantId: formData.restaurant_id,
            price: Number(formData.price) || formData.price,
            imageBase64: formData.image_base64
        };

        try {
            console.log("=== THÔNG TIN GỬI LÊN BACKEND ===");
            console.log("Payload:", {
                ...payload,
                imageBase64: payload.imageBase64 ? payload.imageBase64.substring(0, 50) + "... [Tổng cộng: " + payload.imageBase64.length + " ký tự]" : "Không có ảnh"
            });
            console.log("Xem chiết xuất Base64 thật (ẩn trong console):", payload.imageBase64);

            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, payload);
                alert("Cập nhật thành công!");
            } else {
                await productService.createProduct(payload);
                alert("Thêm mới thành công!");
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
            try {
                await productService.deleteProduct(id);
                fetchProducts();
                alert("Đã xóa thành công.");
            } catch (error) {
                console.error("Lỗi xóa sản phẩm", error);

                // Xử lý báo lỗi chung
                let errorMsg = "Lỗi khi xóa!";
                if (error.response && error.response.data) {
                    if (typeof error.response.data === 'string') {
                        errorMsg = error.response.data;
                    } else if (error.response.data.message) {
                        errorMsg = error.response.data.message;
                    }
                }
                alert(errorMsg);
            }
        }
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div className="flex bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <SidebarAdmin />
            <div className="layout-container flex h-full grow flex-col w-full">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-4xl">payments</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">SmartPay Admin</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/20 transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden">
                            <img alt="Admin Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx1i1qDBEHy72LRpOoD88WSzc1WWu6cBrsuqWZxNctD-paEqGKBBNFrm_p3S1hP7cMcW0h8HtD65-o4lryLLgPtKI7jFE2SOOXuIexDEb8q2D8SlyMabbpT1FGvUpbYdp0qrzNtYpx_3INVMEQygZkP8jCRLmUf8nsPOU7ZQksDo5CaQkYkvROcX9O3nZnj3sTW_yDX12xmqV_d1SguByBa9W9AhuCXw-cMVEqaqlghN89XXkyCIjxa9IJR13INCaTTaH9Gx4-5T5Z" />
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto w-full px-4 lg:px-10 py-8">
                    {/* Page Title & Actions */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Quản lý món ăn</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Quản lý danh sách thực đơn và sản phẩm của hệ thống</p>
                        </div>
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            <span>Thêm món mới</span>
                        </button>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                    placeholder="Tìm kiếm tên món ăn..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                />
                            </div>
                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100"
                                    value={categoryId}
                                    onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Restaurant Filter */}
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100"
                                    value={restaurantId}
                                    onChange={(e) => { setRestaurantId(e.target.value); setPage(1); }}
                                >
                                    <option value="">Tất cả cửa hàng</option>
                                    {restaurants.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tên món</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Danh mục</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cửa hàng</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Giá bán</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đánh giá</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-slate-500">Đang tải dữ liệu...</td>
                                        </tr>
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-slate-500">Không tìm thấy món ăn nào</td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        {product.category?.name || product.category_name || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {product.restaurant?.name || product.restaurant_name || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-primary">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <span className={`material-symbols-outlined text-sm ${product.rating_avg > 0 ? 'filled' : ''}`}>star</span>
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                            {product.rating_avg || '0.0'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${product.status === 'available' ? 'bg-primary/20 text-slate-900 dark:text-primary' :
                                                            product.status === 'unavailable' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-200 text-slate-600'}`
                                                    }>
                                                        {product.status === 'available' ? 'Còn hàng' : product.status === 'unavailable' ? 'Ngưng bán' : 'Ẩn'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleOpenView(product)} className="p-2 text-slate-400 hover:text-green-500 transition-colors"><span className="material-symbols-outlined">visibility</span></button>
                                                        <button onClick={() => handleOpenEdit(product)} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Hiển thị {(page - 1) * limit + 1}-{Math.min(page * limit, total)} trong số {total} món ăn
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>

                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage(idx + 1)}
                                        className={`px-3 py-1 rounded text-sm ${page === idx + 1 ? 'bg-primary text-slate-900 font-bold border-transparent' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary/10 transition-colors'}`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary/10 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Backdrop */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    {/* Add/Edit Modal */}
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                                {editingProduct ? 'Chi tiết món ăn' : 'Thêm món ăn mới'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="md:col-span-2 space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Tên món ăn <span className="text-red-500">*</span></span>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-slate-100"
                                            type="text"
                                            placeholder="Nhập tên món ăn"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Mô tả</span>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-slate-100"
                                            rows="3"
                                            placeholder="Nhập mô tả món ăn"
                                        ></textarea>
                                    </label>
                                </div>

                                {/* Category & Restaurant */}
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Danh mục <span className="text-red-500">*</span></span>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="" disabled>Chọn danh mục</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Cửa hàng <span className="text-red-500">*</span></span>
                                    <select
                                        name="restaurant_id"
                                        value={formData.restaurant_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="" disabled>Chọn cửa hàng</option>
                                        {restaurants.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </label>

                                {/* Price & Status */}
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Giá bán (VNĐ) <span className="text-red-500">*</span></span>
                                    <div className="relative">
                                        <input
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100"
                                            type="number"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">đ</span>
                                    </div>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Trạng thái</span>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="available">Còn hàng (Available)</option>
                                        <option value="unavailable">Ngưng bán (Unavailable)</option>
                                    </select>
                                </label>

                                {/* Image Upload */}
                                <div className="md:col-span-2">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Hình ảnh món ăn</span>
                                    <div className="flex items-center gap-6">
                                        <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 relative group">
                                            {imagePreview ? (
                                                <img alt="Preview" className="h-full w-full object-cover" src={getSafeImageUrl(imagePreview)} />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined text-3xl">image</span>
                                                </div>
                                            )}
                                            <div
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                onClick={() => document.getElementById('image-input').click()}
                                            >
                                                <span className="material-symbols-outlined text-white">camera_alt</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                id="image-input"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('image-input').click()}
                                                className="w-full py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-slate-400 flex flex-col items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-3xl">upload_file</span>
                                                <span className="text-xs font-medium uppercase tracking-widest">Tải lên hình ảnh mới</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Read Only (Only show on Edit) */}
                                {editingProduct && (
                                    <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                                        <div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Đánh giá trung bình</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Từ {editingProduct.rating_count || 0} lượt khách hàng</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-500">
                                            <span className="material-symbols-outlined text-2xl">star</span>
                                            <span className="text-2xl font-black">{editingProduct.rating_avg || '0.0'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Actions footer directly included into the form via modal footer */}
                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Hủy bỏ</button>
                                <button type="submit" className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Product Detail Modal */}
            {viewingProduct && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                                Chi tiết món ăn
                            </h3>
                            <button onClick={handleCloseView} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body Scrollable */}
                        <div className="overflow-y-auto w-full flex flex-col no-scrollbar">
                            {/* Product Image Cover Top (Flexible Height) */}
                            <div className="w-full border-b border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center p-4">
                                {(viewingProduct.image_base64 || viewingProduct.imageBase64 || viewingProduct.image || viewingProduct.image_url || viewingProduct.imageUrl) ? (
                                    <img
                                        src={getSafeImageUrl(viewingProduct.image_base64 || viewingProduct.imageBase64 || viewingProduct.image || viewingProduct.image_url || viewingProduct.imageUrl)}
                                        alt={viewingProduct.name}
                                        className="max-w-full max-h-80 object-contain rounded-xl shadow-sm"
                                    />
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-5xl mb-2">broken_image</span>
                                        <span className="text-sm font-medium">Chưa có hình ảnh</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 pb-10 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="pr-4">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{viewingProduct.name}</h2>
                                        <p className="text-primary font-bold text-xl mt-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(viewingProduct.price)}</p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap border ${viewingProduct.status === 'available' ? 'bg-primary/10 text-primary border-primary/20' : viewingProduct.status === 'unavailable' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-500/20' : 'bg-slate-200 text-slate-600 border-slate-300'} `}>
                                        {viewingProduct.status === 'available' ? 'Còn hàng' : viewingProduct.status === 'unavailable' ? 'Ngưng bán' : 'Ẩn'}
                                    </div>
                                </div>
                                <div className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mt-2 mb-4">
                                    {viewingProduct.category?.name || viewingProduct.category_name || 'Danh mục'}
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 mt-2">
                                    {viewingProduct.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
                                </p>

                                {/* Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Restaurant Info */}
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 text-left border border-slate-100 dark:border-slate-800 rounded-xl mb-6">
                                        <div className="size-12 min-w-12 rounded-lg bg-white dark:bg-slate-800 border-2 border-primary flex items-center justify-center overflow-hidden">
                                            {viewingProduct.restaurant?.logo_url || viewingProduct.restaurant?.logo_base64 || viewingProduct.restaurant?.logoBase64 ? (
                                                <img src={getSafeImageUrl(viewingProduct.restaurant.logo_base64 || viewingProduct.restaurant.logoBase64 || viewingProduct.restaurant.logo_url)} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-primary">store</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{viewingProduct.restaurant?.name || viewingProduct.restaurant_name || '-'}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1 mt-0.5 mt-1 line-clamp-1">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span> Cửa hàng
                                            </p>
                                        </div>
                                    </div>

                                    {/* Ratings Summary */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 text-left border border-slate-100 dark:border-slate-800 rounded-xl mb-6">
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">Đánh giá chung</h4>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Từ {viewingProduct.rating_count || 0} lượt mua</div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <span className="text-yellow-500 material-symbols-outlined fill-1 text-3xl">star</span>
                                            <span className="font-black text-slate-900 dark:text-slate-100 text-lg leading-none">{viewingProduct.rating || viewingProduct.rating_avg || '0.0'}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* Footer Spacer */}
                        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button onClick={handleCloseView} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-all">Đóng trang tính</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

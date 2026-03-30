import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';
import merchantProductService from '../api/merchantProductService';
import { useRestaurant } from '../context/RestaurantContext';
import apiClient from '../../../api/apiClient';
import Swal from 'sweetalert2';

const getSafeImageUrl = (imgData) => {
    if (!imgData) return '';
    const cleanStr = typeof imgData === 'string' ? imgData.replace(/[\r\n\s]+/g, '') : '';
    if (cleanStr.startsWith('http') || cleanStr.startsWith('/')) return cleanStr;
    if (cleanStr.startsWith('data:image')) return cleanStr;
    if (cleanStr) return `data:image/jpeg;base64,${cleanStr}`;
    return '';
};

const MerchantMenuPage = () => {
    const navigate = useNavigate();
    const { error: contextError } = useRestaurant();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Tất cả');
    
    // Pagination
    const [page, setPage] = useState(0);
    const [limit] = useState(20);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
    const [currentProduct, setCurrentProduct] = useState({
        name: '', description: '', price: '', imageBase64: '', categoryId: '', status: 'AVAILABLE'
    });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const fetchCategories = async () => {
        try {
            // Adjust endpoint if needed. Common pattern:
            const res = await apiClient.get('/api/categories');
            if (res.data) {
                const catList = res.data.content || res.data.data || res.data;
                if (Array.isArray(catList)) {
                    setCategories(catList);
                }
            }
        } catch (error) {
            console.warn("Could not fetch categories", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Updated to 1-based page and limit parameter
            const res = await merchantProductService.getProducts({ 
                page: page + 1, 
                limit: limit 
            });
            
            if (res.data) {
                // Handle { data: [], pagination: {} } or { content: [] } or just []
                const list = res.data.data || res.data.content || (Array.isArray(res.data) ? res.data : []);
                
                // DEBUG: Help the user verify if the backend is really sending 'status' field
                if (list.length > 0) {
                    console.log("=== PRODUCT DATA FROM API [Sample Item] ===");
                    console.log(list[0]);
                    if (list[0].status === undefined) {
                        console.warn("WARNING: The 'status' field is missing from the API response. Defaulting to 'AVAILABLE' in UI.");
                    }
                }

                // Process list to ensure status is handled correctly
                const processedList = list.map(item => ({
                    ...item,
                    status: item.status || 'AVAILABLE'
                }));
                setProducts(processedList);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
            // Don't show alert for 400 errors which might be "no restaurant"
            if (error.response?.status !== 400) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải danh sách sản phẩm' });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [page]);

    // Handle Form
    const handleOpenModal = (mode, product = null) => {
        setModalMode(mode);
        if (mode === 'edit' && product) {
            setCurrentProduct({
                id: product.id,
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                imageBase64: product.imageBase64 || product.image_base_64 || product.imageUrl || '',
                categoryId: product.categoryId || '',
                status: (product.status || 'AVAILABLE').toUpperCase()
            });
        } else {
            setCurrentProduct({ name: '', description: '', price: '', imageBase64: '', categoryId: categories.length > 0 ? categories[0].id : '', status: 'AVAILABLE' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct({ name: '', description: '', price: '', imageBase64: '', categoryId: '', status: 'AVAILABLE' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire('Lỗi', 'Kích thước ảnh không được vượt quá 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentProduct(prev => ({ ...prev, imageBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        
        if (!currentProduct.name || !currentProduct.price) {
            Swal.fire('Thiếu thông tin', 'Vui lòng nhập tên và giá sản phẩm', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const payload = { ...currentProduct, price: parseFloat(currentProduct.price) };
            
            if (modalMode === 'add') {
                await merchantProductService.createProduct(payload);
                Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã thêm sản phẩm mới', timer: 1500, showConfirmButton: false });
            } else {
                await merchantProductService.updateProduct(currentProduct.id, payload);
                Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật sản phẩm thành công', timer: 1500, showConfirmButton: false });
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: `Không thể ${modalMode === 'add' ? 'thêm' : 'cập nhật'} sản phẩm` });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: 'Xóa sản phẩm?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await merchantProductService.deleteProduct(id);
                Swal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Sản phẩm đã bị xóa.', timer: 1500, showConfirmButton: false });
                fetchProducts();
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xóa sản phẩm lúc này' });
            }
        }
    };

    const handleToggleStatus = async (product) => {
        const originalStatus = (product.status || 'AVAILABLE').toUpperCase();
        const newStatus = originalStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
        
        // Optimistic update
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));

        try {
            await merchantProductService.updateProductStatus(product.id, newStatus.toLowerCase());
            // Optionally: if the API returns the updated object, we could use it
            // but for a toggle, optimistic + background fetch (if needed) is fine.
            // fetchProducts(); // Only if we want to sync other fields
        } catch (error) {
            // Rollback
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: originalStatus } : p));
            Swal.fire({ 
                icon: 'error', 
                title: 'Lỗi', 
                text: error.response?.status === 403 
                    ? 'Bạn không có quyền chỉnh sửa món ăn này' 
                    : 'Không thể thay đổi trạng thái sản phẩm' 
            });
        }
    };

    const formatCurrency = (amount) => {
        if (amount == null) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Filter products logically if we fetch all
    const filteredProducts = activeTab === 'Tất cả' 
        ? products 
        : products.filter(p => p.categoryName === activeTab || (categories.find(c => c.id === p.categoryId)?.name === activeTab));

    const displayCategories = ['Tất cả', ...categories.map(c => c.name)];

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
        <div className="bg-white text-slate-900 h-screen flex font-display relative">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Quản lý Menu" />

                <div className="p-8">
                    {/* Page Actions */}
                    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                            {displayCategories.length > 1 ? displayCategories.map((cat, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveTab(cat)}
                                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeTab === cat ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'}`}
                                >
                                    {cat}
                                </button>
                            )) : (
                                <button className="px-5 py-2 rounded-full font-bold text-sm bg-primary text-background-dark shadow-lg shadow-primary/20">Tất cả</button>
                            )}
                        </div>
                        <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 bg-primary text-background-dark px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary/10">
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Thêm Món Mới</span>
                        </button>
                    </div>

                    {/* Items Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                            <p className="text-slate-500 font-medium text-sm">Đang tải danh sách món...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {filteredProducts.map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                                        {item.imageBase64 || item.image_base_64 || item.imageUrl ? (
                                            <img 
                                                src={getSafeImageUrl(item.imageBase64 || item.image_base_64 || item.imageUrl)} 
                                                alt={item.name} 
                                                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${(item.status || 'AVAILABLE').toUpperCase() === 'UNAVAILABLE' ? 'grayscale opacity-80' : ''}`} 
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                <span className="material-symbols-outlined text-5xl">restaurant_menu</span>
                                            </div>
                                        )}
                                        {(item.status || 'AVAILABLE').toUpperCase() === 'UNAVAILABLE' && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Hết Hàng</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 shadow-sm">
                                                {item.categoryName || categories.find(c => c.id === item.categoryId)?.name || 'Món'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h3 className="font-bold text-lg tracking-tight line-clamp-1">{item.name}</h3>
                                                <span className="text-primary font-black whitespace-nowrap">{formatCurrency(item.price)}</span>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2 min-h-[32px] font-medium">{item.description}</p>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">category</span>
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">ID: {item.id}</span>
                                                </div>
                                                <div className="flex items-center gap-2" title={(item.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE' ? 'Nhấn để ngưng bán' : 'Nhấn để mở bán'}>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {(item.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE' ? 'Bật' : 'Tắt'}
                                                    </span>
                                                    <button onClick={() => handleToggleStatus(item)} className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${(item.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                                        <span className={`absolute top-0.5 size-4 bg-white rounded-full transition-all shadow ${(item.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE' ? 'right-0.5' : 'left-0.5'}`}></span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => handleOpenModal('edit', item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase tracking-wider active:scale-95">
                                                    <span className="material-symbols-outlined text-sm">edit</span> Sửa
                                                </button>
                                                <button onClick={() => handleDeleteProduct(item.id)} className="p-2 bg-slate-100 dark:bg-slate-800 text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors active:scale-95" title="Xóa món">
                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Add Placeholder */}
                            <button onClick={() => handleOpenModal('add')} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-full min-h-[380px] flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-800 transition-all group group hover:border-primary active:scale-95">
                                <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all duration-300 group-hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-700 dark:text-slate-200">Tạo Món Mới</p>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Thêm vào thực đơn</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Add/Edit using standard React absolute positioning overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">{modalMode === 'add' ? 'add_circle' : 'edit_square'}</span>
                                {modalMode === 'add' ? 'Thêm Sản Phẩm Mới' : 'Cập Nhật Sản Phẩm'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6 overflow-y-auto no-scrollbar">
                            <form id="productForm" onSubmit={handleSaveProduct} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Image Upload Area */}
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hình ảnh sản phẩm</label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer overflow-hidden relative group"
                                        >
                                            {currentProduct.imageBase64 ? (
                                                <>
                                                    <img src={getSafeImageUrl(currentProduct.imageBase64)} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Thay đổi</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2 block">add_photo_alternate</span>
                                                    <span className="text-xs font-medium text-slate-500">Tải ảnh lên<br/>(Tối đa 2MB)</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/jpeg, image/png, image/webp" 
                                            ref={fileInputRef} 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                        />
                                    </div>
                                    
                                    {/* Text Fields */}
                                    <div className="col-span-1 md:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tên sản phẩm <span className="text-rose-500">*</span></label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={currentProduct.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="VD: Cơm sườn nướng..."
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Giá bán (VNĐ) <span className="text-rose-500">*</span></label>
                                                <input 
                                                    type="number" 
                                                    name="price"
                                                    value={currentProduct.price}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    placeholder="VD: 55000"
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Danh mục</label>
                                                <div className="relative">
                                                    <select 
                                                        name="categoryId"
                                                        value={currentProduct.categoryId}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
                                                    >
                                                        <option value="">Chọn danh mục</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-4 top-3 text-slate-400 pointer-events-none">expand_more</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mô tả sản phẩm</label>
                                            <textarea 
                                                name="description"
                                                value={currentProduct.description}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Khẩu phần ăn, thành phần, kích cỡ..."
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900 mt-auto">
                            <button 
                                type="button" 
                                onClick={handleCloseModal}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Hủy Bỏ
                            </button>
                            <button 
                                type="submit" 
                                form="productForm"
                                disabled={isSaving}
                                className="px-8 py-2.5 rounded-lg bg-primary text-background-dark font-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center min-w-[120px] disabled:opacity-75 disabled:active:scale-100 disabled:cursor-wait"
                            >
                                {isSaving ? (
                                    <span className="material-symbols-outlined animate-spin font-bold">progress_activity</span>
                                ) : (
                                    modalMode === 'add' ? 'Lưu Sản Phẩm' : 'Cập Nhật'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MerchantMenuPage;

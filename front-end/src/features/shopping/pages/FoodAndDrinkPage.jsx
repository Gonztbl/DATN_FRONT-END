import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import shoppingService from '../../../services/shoppingService';
import profileService from '../../../services/profileService';
import walletService from '../../../services/walletService';
import productService from '../../../services/productService';
import vendorService from '../../../services/vendorService';
import { useAuth } from '../../auth/context/AuthContext';

const getSafeImageUrl = (imgData) => {
    if (!imgData) return '';
    const cleanStr = typeof imgData === 'string' ? imgData.replace(/[\r\n\s]+/g, '') : '';
    if (cleanStr.startsWith('http') || cleanStr.startsWith('/')) return cleanStr;
    if (cleanStr.startsWith('data:image')) return cleanStr;
    if (cleanStr) return `data:image/jpeg;base64,${cleanStr}`;
    return '';
};

const FoodAndDrinkPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State quản lý danh sách
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    // State bộ lọc và tìm kiếm
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8);

    // State cho Modal (Chi tiết sản phẩm)
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productReviews, setProductReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);

    // State cho Checkout Form
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Lấy dữ liệu khi trang render
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchUserProfile(),
                    fetchBalance(),
                    fetchCategories()
                ]);
            } catch (error) {
                console.error("Lỗi khi load dữ liệu ban đầu:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Reset về trang 1 khi đổi category hoặc search
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, searchQuery]);

    // Load lại sản phẩm khi đổi category, page, hoặc gõ chữ search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, page]);

    const fetchUserProfile = async () => {
        try {
            const data = await profileService.getCurrentUser();
            setUserProfile(data);
            if (data) {
                setRecipientName(data.name || '');
                setRecipientPhone(data.phone || '');
                setDeliveryAddress(data.address || '');
            }
        } catch (error) {
            console.error("Không thể load profile", error);
        }
    };

    const fetchBalance = async () => {
        try {
            const data = await walletService.getBalance();
            setBalance(data.balance || 0);
        } catch (error) {
            console.error("Không thể load số dư", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await vendorService.getCategories({ limit: 100 });
            const list = Array.isArray(data) ? data : (data?.content || data?.data || []);
            if (list.length > 0) {
                setCategories([{ id: null, name: "Tất cả", icon: "grid_view" }, ...list.filter(c => c.name !== "Tất cả")]);
            } else {
                setCategories([
                    { id: null, name: "Tất cả", icon: "grid_view" },
                    { id: 1, name: "Bữa sáng", icon: "bakery_dining" },
                    { id: 2, name: "Bữa trưa", icon: "lunch_dining" },
                    { id: 3, name: "Đồ uống", icon: "local_cafe" },
                    { id: 4, name: "Ăn vặt", icon: "cookie" }
                ]);
            }
        } catch (error) {
            console.error("Không thể load danh mục", error);
            setCategories([
                { id: null, name: "Tất cả", icon: "grid_view" },
                { id: 1, name: "Bữa sáng", icon: "bakery_dining" },
                { id: 2, name: "Bữa trưa", icon: "lunch_dining" }
            ]);
        }
    };

    const fetchProducts = async () => {
        try {
            const params = {
                page: page - 1,
                size: limit
            };
            if (selectedCategory) params.category_id = selectedCategory;
            if (searchQuery.trim()) params.search = searchQuery;

            const data = await productService.getProducts(params);

            if (data && data.content) {
                setProducts(data.content);
                setTotalPages(data.totalPages || 1);
            } else if (Array.isArray(data)) {
                setProducts(data);
                setTotalPages(1);
            } else if (data && data.data) {
                setProducts(data.data);
                setTotalPages(data.pagination?.totalPages || 1);
            } else {
                setProducts([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Không thể load sản phẩm", error);
        }
    };

    const handleOpenModal = async (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setShowModal(true);

        try {
            const [detailData, reviewData] = await Promise.all([
                shoppingService.getProductDetails(product.id).catch(() => product),
                shoppingService.getProductReviews(product.id).catch(() => ({ reviews: [] }))
            ]);
            setSelectedProduct(detailData);
            setProductReviews(reviewData?.reviews || []);
        } catch (error) {
            console.error("Lỗi khi fetch chi tiết sản phẩm", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setQuantity(1);
        setProductReviews([]);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newValue = prev + amount;
            return newValue < 1 ? 1 : newValue;
        });
    };

    const handleCheckout = async () => {
        if (!selectedProduct) return;

        if (!deliveryAddress || !recipientName || !recipientPhone) {
            alert("Vui lòng nhập đủ thông tin giao hàng!");
            return;
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                user_id: user?.id || 1,
                items: [
                    {
                        product_id: selectedProduct.id,
                        quantity: quantity,
                        price: selectedProduct.price
                    }
                ],
                delivery_address: deliveryAddress,
                recipient_name: recipientName,
                recipient_phone: recipientPhone,
                note: note,
                payment_method: "SmartPay"
            };

            const result = await shoppingService.createOrder(orderPayload);
            alert(`Đặt hàng thành công! Mã đơn: ${result.order_id}`);

            fetchBalance();
            handleCloseModal();
            setDeliveryAddress('');
            setRecipientName('');
            setRecipientPhone('');
            setNote('');
        } catch (error) {
            alert("Có lỗi xảy ra khi đặt hàng.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

    // Category icon color map
    const iconColors = {
        'bakery_dining': 'text-orange-400',
        'lunch_dining': 'text-red-400',
        'local_cafe': 'text-blue-400',
        'cookie': 'text-green-500',
        'local_bar': 'text-purple-400',
        'icecream': 'text-pink-400',
        'restaurant': 'text-slate-500',
    };

    // Skeleton components
    const CategorySkeleton = () => (
        <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-200 animate-pulse min-w-[120px] h-12" />
            ))}
        </div>
    );

    const ProductCardSkeleton = () => (
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse flex flex-col">
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="flex items-center justify-between mt-4">
                    <div className="h-6 w-20 bg-slate-200 rounded" />
                    <div className="h-9 w-20 bg-slate-200 rounded-xl" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans"
            style={{
                backgroundColor: '#f0f9f4',
                backgroundImage: `
                    linear-gradient(135deg, #f0f9f4 0%, #e1f2e8 100%),
                    radial-gradient(circle at 2px 2px, rgba(25, 230, 107, 0.05) 1px, transparent 0)
                `,
                backgroundSize: '100% 100%, 40px 40px',
            }}
        >
            {/* ═══════════════ HEADER ═══════════════ */}
            <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 md:px-10 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/30">
                                <span className="material-symbols-outlined text-white font-bold block">account_balance_wallet</span>
                            </div>
                            <h2 className="text-slate-900 text-2xl font-black tracking-tight">SmartPay</h2>
                        </div>
                        {/* Nav */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <a onClick={() => navigate('/dashboard')} className="text-slate-600 text-sm font-bold hover:text-emerald-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-emerald-500">Trang Chủ</a>
                            <a className="text-slate-500 text-sm font-semibold hover:text-emerald-500 transition-all cursor-pointer" href="#">Lịch sử mua</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Balance */}
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
                            <span className="material-symbols-outlined text-emerald-600 text-sm font-bold">payments</span>
                            <span className="text-emerald-600 font-bold text-sm whitespace-nowrap">{formatCurrency(balance)}</span>
                        </div>
                        {/* Search */}
                        <div className="hidden md:flex relative group">
                            <input
                                className="bg-slate-100/50 border-none rounded-full py-2.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                placeholder="Tìm kiếm món ngon..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══════════════ MAIN ═══════════════ */}
            <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                {/* Category Section */}
                <div className="mb-10">

                    {/* Category Pill Buttons */}
                    {loading && categories.length === 0 ? (
                        <CategorySkeleton />
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {categories.map((category) => (
                                <button
                                    key={category.id || 'all'}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${selectedCategory === category.id
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20 font-bold'
                                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${selectedCategory === category.id
                                        ? 'text-white'
                                        : iconColors[category.icon] || 'text-slate-400'
                                        }`}>
                                        {category.icon || 'restaurant'}
                                    </span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══════ Product Grid ═══════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-pointer flex flex-col"
                                onClick={() => handleOpenModal(product)}
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src={getSafeImageUrl(product.image_base64 || product.imageBase64 || product.image_url || product.imageUrl)}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                        }}
                                    />
                                    {/* Category badge */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-wider">
                                        {product.category?.name || "Món ngon"}
                                    </div>
                                    {/* Rating badge */}
                                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-md">
                                        <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        {product.rating_avg || product.rating || '4.5'}
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.1em]">
                                        {product.category?.name || "Món ngon"}
                                    </span>
                                    <h3 className="text-slate-900 text-lg font-bold mt-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                                        {product.description || 'Món ăn hấp dẫn với hương vị đặc trưng.'}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <span className="text-slate-900 font-black text-xl">{formatCurrency(product.price)}</span>
                                        <button
                                            className="flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl text-slate-600 font-bold text-sm transition-all"
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span> Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white/30">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">no_food</span>
                            <p className="text-lg font-bold opacity-50">Không tìm thấy sản phẩm nào.</p>
                            <button
                                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                                className="mt-4 text-sm font-bold text-emerald-500 hover:underline"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`size-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all shadow-sm ${page === i + 1
                                    ? 'bg-emerald-500 text-white border-transparent'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}
            </main>

            {/* ═══════════════ MODAL ═══════════════ */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-md">
                    <div
                        className="bg-white w-full max-w-6xl max-h-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20"
                        style={{ animation: 'fadeIn 0.3s ease-out' }}
                    >
                        {/* ── Left: Product Detail ── */}
                        <div className="w-full md:w-1/2 overflow-y-auto border-r border-slate-100 bg-white" style={{ scrollbarWidth: 'none' }}>
                            {/* Image */}
                            <div className="relative h-64 md:h-[450px] w-full overflow-hidden">
                                <img
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                    src={getSafeImageUrl(selectedProduct.image_base64 || selectedProduct.imageBase64 || selectedProduct.image_url || selectedProduct.imageUrl)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                    }}
                                />
                                <button
                                    className="absolute top-6 left-6 size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    onClick={handleCloseModal}
                                >
                                    <span className="material-symbols-outlined text-slate-900">arrow_back</span>
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2>
                                        <p className="text-emerald-500 font-black text-3xl mt-2">{formatCurrency(selectedProduct.price)}</p>
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-200">
                                        {selectedProduct.restaurant?.is_open === false ? 'Đóng cửa' : 'Đang bán'}
                                    </div>
                                </div>
                                <p className="text-slate-500 text-base leading-relaxed mb-8">
                                    {selectedProduct.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
                                </p>

                                {/* Restaurant Info */}
                                {selectedProduct.restaurant && (
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
                                                {(selectedProduct.restaurant.logo_url || selectedProduct.restaurant.logo_base64 || selectedProduct.restaurant.logoBase64) ? (
                                                    <img src={getSafeImageUrl(selectedProduct.restaurant.logo_base64 || selectedProduct.restaurant.logoBase64 || selectedProduct.restaurant.logo_url)} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-emerald-500 text-3xl">storefront</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">{selectedProduct.restaurant.name}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                    {selectedProduct.restaurant.address || 'Chưa cập nhật địa chỉ'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                    </div>
                                )}

                                {/* Reviews */}
                                <div className="border-t border-slate-100 pt-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="font-black text-xl">Đánh giá thực khách</h4>
                                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-lg">
                                            <span className="text-yellow-500 material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="font-black text-slate-900">{selectedProduct.rating || selectedProduct.rating_avg || '0'}</span>
                                            <span className="text-slate-400 text-xs font-medium">({selectedProduct.rating_count || 0})</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {productReviews.length > 0 ? (
                                            productReviews.map(review => (
                                                <div key={review.id} className="pb-6 border-b border-slate-50 last:border-0">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                                                                {review.user?.avatar_url ? (
                                                                    <img src={review.user.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    (review.user?.name || 'K').charAt(0).toUpperCase()
                                                                )}
                                                            </div>
                                                            <span className="font-bold text-sm">{review.user?.name || 'Khách'}</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 italic">"{review.comment}"</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">
                                                Chưa có nhận xét nào
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Delivery & Checkout ── */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-slate-50 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500 bg-emerald-500/10 p-2 rounded-xl">local_shipping</span>
                                Giao hàng tới
                            </h3>

                            <div className="space-y-6 flex-1">
                                {/* GPS Option */}
                                <button className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-emerald-500 bg-white text-left shadow-sm shadow-emerald-500/5 transition-all">
                                    <div className="size-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <span className="material-symbols-outlined font-bold">my_location</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 text-lg leading-tight">Vị trí hiện tại</p>
                                        <p className="text-xs text-slate-500 mt-1">Sử dụng định vị GPS</p>
                                    </div>
                                    <span className="material-symbols-outlined text-emerald-500 text-3xl font-bold">check_circle</span>
                                </button>

                                {/* Divider */}
                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Thông tin người nhận</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                {/* Form */}
                                <div className="space-y-5">
                                    {/* Address */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Địa chỉ chi tiết</label>
                                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-4 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                                            <span className="material-symbols-outlined text-slate-400 text-xl mr-3">map</span>
                                            <input
                                                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium p-0 outline-none"
                                                placeholder="Số nhà, tên đường, phường..."
                                                type="text"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Name & Phone */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Họ & Tên</label>
                                            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-4 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                                                <input
                                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium p-0 outline-none"
                                                    placeholder="Tên của bạn"
                                                    type="text"
                                                    value={recipientName}
                                                    onChange={(e) => setRecipientName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Số điện thoại</label>
                                            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-4 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                                                <input
                                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium p-0 outline-none"
                                                    placeholder="0xxx..."
                                                    type="tel"
                                                    value={recipientPhone}
                                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Note */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Ghi chú (Tùy chọn)</label>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-slate-200 transition-all outline-none"
                                            placeholder="Ví dụ: Không lấy đũa, nhiều ớt..."
                                            rows="2"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Action */}
                            <div className="mt-10 pt-8 border-t border-slate-200">
                                {/* Quantity */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-slate-500 font-bold">Số lượng:</span>
                                    <div className="flex items-center bg-white border border-slate-200 rounded-full p-1.5 shadow-sm">
                                        <button
                                            className="size-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-slate-100 transition-colors"
                                            onClick={() => handleQuantityChange(-1)}
                                        >
                                            <span className="material-symbols-outlined text-lg">remove</span>
                                        </button>
                                        <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                        <button
                                            className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                                            onClick={() => handleQuantityChange(1)}
                                        >
                                            <span className="material-symbols-outlined text-lg font-bold">add</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tổng cộng</span>
                                        <span className="text-3xl font-black text-slate-900">{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                                        <span className="text-[10px] text-green-600 font-black uppercase tracking-tighter">Bảo mật bởi SmartPay</span>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgb(16,185,129,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                                            Đặt hàng ngay với SmartPay
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Keyframe animation for modal */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default FoodAndDrinkPage;

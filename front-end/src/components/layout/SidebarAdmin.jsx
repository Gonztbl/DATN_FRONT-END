import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const ADMIN_PAGES = [
    { title: "Lịch sử giao dịch", path: "/admin/transactions", icon: "receipt_long" },
    { title: "Cảnh báo gian lận", path: "/admin/fraud-alerts", icon: "security_update_warning" },
    { title: "Đơn hàng", path: "/admin/orders", icon: "shopping_bag" },
    { title: "Người dùng", path: "/user-manager", icon: "group" },
    { title: "Tạo người dùng", path: "/admin/users/create", icon: "person_add" },
    { title: "Ví hệ thống", path: "/admin/wallets", icon: "account_balance" },
    { title: "Quản lý Danh mục", path: "/admin/vendor-manager", icon: "category" },
    { title: "Quản lý Cửa hàng", path: "/admin/restaurant-manager", icon: "restaurant" },
    { title: "Quản lý Sản phẩm", path: "/admin/product-manager", icon: "lunch_dining" },
    { title: "Khoản vay - Duyệt", path: "/admin/loans", icon: "description" },
    { title: "Tất cả đơn vay", path: "/admin/loans/all", icon: "folder_open" },
];

export default function SidebarAdmin() {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setIsDropdownOpen(false);
            return;
        }

        const filtered = ADMIN_PAGES.filter(page =>
            page.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsDropdownOpen(true);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (path) => {
        navigate(path);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    return (
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 hidden lg:flex">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[#121617] dark:text-white text-base font-bold leading-tight">SmartPay Admin</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Quản lý tài chính</p>
                    </div>
                </div>

                {/* Quick Search Input */}
                <div className="relative mb-6" ref={searchRef}>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 focus-within:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm trang..."
                            className="bg-transparent border-none outline-none text-xs w-full text-slate-600 dark:text-slate-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.trim() !== '' && setIsDropdownOpen(true)}
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden">
                            {searchResults.length > 0 ? (
                                <div className="flex flex-col max-h-60 overflow-y-auto">
                                    {searchResults.map((result) => (
                                        <button
                                            key={result.path}
                                            onClick={() => handleResultClick(result.path)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                        >
                                            <span className="material-symbols-outlined text-sm text-slate-400">{result.icon}</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{result.title}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-3 text-center">
                                    <p className="text-[10px] text-slate-500 italic">Không tìm thấy trang</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <nav className="flex flex-col gap-1 text-slate-600 dark:text-slate-400">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 ml-3">Menu chính</p>
                    <Link
                        to="/admin/transactions"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/transactions')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span className="text-sm">Lịch sử giao dịch</span>
                    </Link>

                    <Link
                        to="/admin/fraud-alerts"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/fraud-alerts')
                            ? 'bg-amber-500/10 text-amber-500 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">security_update_warning</span>
                        <span className="text-sm">Cảnh báo gian lận</span>
                    </Link>
                    
                    <Link
                        to="/admin/orders"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/orders')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span className="text-sm">Đơn hàng</span>
                    </Link>

                    <Link
                        to="/user-manager"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/user-manager')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm">Người dùng</span>
                    </Link>

                    <Link
                        to="/admin/wallets"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/wallets')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">account_balance</span>
                        <span className="text-sm">Ví hệ thống</span>
                    </Link>

                    <Link
                        to="/admin/vendor-manager"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/vendor-manager')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">category</span>
                        <span className="text-sm">Quản lý Danh mục</span>
                    </Link>

                    <Link
                        to="/admin/restaurant-manager"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/restaurant-manager')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">restaurant</span>
                        <span className="text-sm">Quản lý Cửa hàng</span>
                    </Link>

                    <Link
                        to="/admin/product-manager"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/product-manager')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">lunch_dining</span>
                        <span className="text-sm">Quản lý Sản phẩm</span>
                    </Link>

                    <Link
                        to="/admin/loans"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/loans')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">description</span>
                        <span className="text-sm">Khoản vay - Duyệt</span>
                    </Link>

                    <Link
                        to="/admin/loans/all"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/loans/all')
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                    >
                        <span className="material-symbols-outlined">folder_open</span>
                        <span className="text-sm">Tất cả đơn vay</span>
                    </Link>
                </nav>
            </div>
            {/* System Status Mock */}
            <div className="mt-auto p-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Trạng thái hệ thống</p>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-semibold dark:text-slate-200">Hoạt động ổn định</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

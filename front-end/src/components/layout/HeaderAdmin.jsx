import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

const ADMIN_PAGES = [
    { title: "History Logs", path: "/admin/transactions", icon: "receipt_long" },
    { title: "Orders", path: "/admin/orders", icon: "shopping_bag" },
    { title: "Users", path: "/user-manager", icon: "group" },
    { title: "Create User", path: "/admin/users/create", icon: "person_add" },
    { title: "Wallets", path: "/admin/wallets", icon: "account_balance" },
    { title: "Vendor Manager", path: "/admin/vendor-manager", icon: "category" },
    { title: "Restaurant Manager", path: "/admin/restaurant-manager", icon: "restaurant" },
    { title: "Product Manager", path: "/admin/product-manager", icon: "lunch_dining" },
];

export default function HeaderAdmin({ title }) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { showSuccess } = useNotification();
    const { isDarkMode, toggleDarkMode } = useTheme();
    
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

    const handleLogout = () => {
        logout();
        showSuccess("Logged out successfully", "Success");
        navigate('/login');
    };

    const handleResultClick = (path) => {
        navigate(path);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    {title && <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{title}</h2>}
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Administration Portal</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Dynamic Quick Search */}
                    <div className="relative" ref={searchRef}>
                        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary/30 transition-all">
                            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                            <input 
                                type="text" 
                                placeholder="Quick search pages..." 
                                className="bg-transparent border-none outline-none text-xs w-32 focus:w-48 transition-all text-slate-600 dark:text-slate-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim() !== '' && setIsDropdownOpen(true)}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {searchResults.length > 0 ? (
                                    <div className="flex flex-col max-h-80 overflow-y-auto">
                                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pages</div>
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.path}
                                                onClick={() => handleResultClick(result.path)}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                            >
                                                <span className="material-symbols-outlined text-lg text-slate-400">{result.icon}</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{result.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 text-center">
                                        <p className="text-xs text-slate-500 italic">No pages found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button 
                            onClick={toggleDarkMode}
                            className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            <span className="material-symbols-outlined transition-all">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName || user?.username || 'Admin'}</span>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-primary">System Administrator</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center group"
                            title="Sign Out"
                        >
                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-0.5">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

import { Link, useLocation } from 'react-router-dom';

export default function SidebarRestaurant() {
    const location = useLocation();
    const isActive = (path) => {
        if (path === '/merchant/dashboard') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/merchant/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/merchant/orders', icon: 'shopping_bag', label: 'Orders' },
        { path: '/merchant/menu', icon: 'restaurant_menu', label: 'Menu Management' },
        { path: '/merchant/settings', icon: 'settings', label: 'Store Settings' },
    ];

    return (
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 hidden lg:flex">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">storefront</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[#121617] dark:text-white text-base font-bold leading-tight">Merchant Hub</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Manage your flavor</p>
                    </div>
                </div>
                
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                isActive(item.path)
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                            }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Merchant Help/Status */}
            <div className="mt-auto p-6">
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Store Status</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-semibold dark:text-slate-200">Open for Orders</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function HeaderAdmin({ title }) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { showSuccess } = useNotification();

    const handleLogout = () => {
        logout();
        showSuccess("Logged out successfully", "Success");
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    {title && <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{title}</h2>}
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Administration Portal</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search Mock */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-transparent border-none outline-none text-xs w-32 focus:w-48 transition-all text-slate-600 dark:text-slate-300"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

                    <div className="flex items-center gap-3">
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const HeaderShipper = ({ title, showBack = false, onBack }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { showSuccess } = useNotification();

    const handleLogout = () => {
        logout();
        showSuccess("Đã đăng xuất thành công", "Thành công");
        navigate('/login');
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button 
                        onClick={handleBack}
                        className="flex items-center justify-center rounded-full bg-primary/20 p-2 text-primary hover:bg-primary/30 transition-colors mr-2"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                )}
                {!showBack && (
                    <div className="text-primary">
                        <span className="material-symbols-outlined text-3xl">delivery_dining</span>
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{title || 'Đơn hàng của tôi'}</h1>
                    {showBack && <p className="text-xs text-slate-500">Chi tiết đơn hàng</p>}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="relative flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>

                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-slate-200">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcLMBp3mX-JN8LGvQlUSWM8XdRJHZ4GjRhLxKMziV5B7OYHffkP3mwuIicynf2yqa2CBQvAhO_0n-0Fu9s9up4XvBSO0lSOnP63LLJS3HObrJbkAoMb2RwJKHq73seHkroAMGY5y2mQlIFi1KvSW-PM13nX02qxULZhUq33rW9NEZrw3OeI8PAYNsWkLXxar7qfzGzgBvCfxQXGVfrfMT80EXi-Mkc20AXhrAfYJaUHxXgiXDmargD5voEG3Rrk3BnbD-EBcm4Njt6" alt="Shipper Avatar" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
};

export default HeaderShipper;

import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback(({ type = 'info', title, message, duration = 3000 }) => {
        setNotification({ type, title, message });

        if (duration > 0) {
            setTimeout(() => {
                setNotification(null);
            }, duration);
        }
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const showSuccess = useCallback((message, title = 'Success') => {
        showNotification({ type: 'success', title, message });
    }, [showNotification]);

    const showError = useCallback((message, title = 'Error') => {
        showNotification({ type: 'error', title, message });
    }, [showNotification]);

    const showInfo = useCallback((message, title = 'Information') => {
        showNotification({ type: 'info', title, message });
    }, [showNotification]);

    const showWarning = useCallback((message, title = 'Warning') => {
        showNotification({ type: 'warning', title, message });
    }, [showNotification]);

    return (
        <NotificationContext.Provider value={{
            showNotification,
            hideNotification,
            showSuccess,
            showError,
            showInfo,
            showWarning,
            notification
        }}>
            {children}
            {notification && (
                <NotificationModal
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

const NotificationModal = ({ type, title, message, onClose }) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    icon: 'check_circle',
                    iconColor: 'text-green-600 dark:text-green-400',
                    titleColor: 'text-green-900 dark:text-green-100'
                };
            case 'error':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800',
                    icon: 'error',
                    iconColor: 'text-red-600 dark:text-red-400',
                    titleColor: 'text-red-900 dark:text-red-100'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-200 dark:border-amber-800',
                    icon: 'warning',
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    titleColor: 'text-amber-900 dark:text-amber-100'
                };
            default: // info
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-200 dark:border-blue-800',
                    icon: 'info',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    titleColor: 'text-blue-900 dark:text-blue-100'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-slideUp">
                <div className="p-6 text-center space-y-4">
                    {/* Icon */}
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${styles.bg} border-2 ${styles.border}`}>
                        <span className={`material-symbols-outlined text-4xl ${styles.iconColor}`}>
                            {styles.icon}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold ${styles.titleColor}`}>
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                        {message}
                    </p>
                </div>

                {/* Close Button */}
                <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

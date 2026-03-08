import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import walletService from '../../../services/walletService';
import { useAuth } from '../context/AuthContext';
import SidebarAdmin from '../../../components/common/SidebarAdmin';
import { useNotification } from '../../../context/NotificationContext';

export default function AdminWalletPage() {
    const navigate = useNavigate();
    const { showError, showSuccess } = useNotification();
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Pagination (Client-side now since we fetch 1000)
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Display 10 per page

    // Topup Modal State
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [topupAmount, setTopupAmount] = useState('');
    const [topupLoading, setTopupLoading] = useState(false);

    // Notification Modal State
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState(null);

    // Fetch large batch for client-side search
    const FETCH_SIZE = 1000;

    useEffect(() => {
        fetchWallets();
    }, []); // Run once

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const data = await walletService.getAllWallets(0, FETCH_SIZE);
            // Check if response is array or page object
            const list = Array.isArray(data) ? data : (data.content || []);
            setWallets(list);
        } catch (err) {
            console.error("Failed to fetch wallets", err);
            setError("Failed to load wallets.");
            setWallets([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredWallets = wallets.filter(wallet => {
        const term = searchText.toLowerCase().trim();
        const matchesSearch =
            !term ||
            (wallet.id && wallet.id.toString().includes(term)) ||
            (wallet.userId && wallet.userId.toString().includes(term)) ||
            (wallet.accountNumber && wallet.accountNumber.toLowerCase().includes(term));

        const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && wallet.status === 'ACTIVE') ||
            (statusFilter === 'LOCKED' && (wallet.status === 'LOCKED' || wallet.status === 'FROZEN')) ||
            wallet.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const pageCount = Math.ceil(filteredWallets.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentWallets = filteredWallets.slice(offset, offset + itemsPerPage);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-GB');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            case 'INACTIVE':
            case 'LOCKED':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLockUnlock = async (wallet) => {
        if (!wallet || !wallet.id) return;
        const isLocked = wallet.status === 'FROZEN' || wallet.status === 'LOCKED';
        const newStatus = isLocked ? 'ACTIVE' : 'LOCKED';

        try {
            if (isLocked) {
                await walletService.unlockWallet(wallet.id);
            } else {
                await walletService.lockWallet(wallet.id);
            }

            // Update local state instead of refetching all wallets
            setWallets(prevWallets =>
                prevWallets.map(w =>
                    w.id === wallet.id
                        ? { ...w, status: newStatus }
                        : w
                )
            );

            // Show success notification
            showSuccess(
                `Wallet ${isLocked ? 'unlocked' : 'locked'} successfully`,
                'Success'
            );
        } catch (err) {
            console.error(`Failed to toggle wallet status`, err);
            showError(err.response?.data?.message || 'Failed to update wallet status. Please try again.', 'Error');
        }
    };

    const isLocked = (status) => status === 'FROZEN' || status === 'LOCKED';

    const handleTopupClick = (wallet) => {
        setSelectedWallet(wallet);
        setTopupAmount('');
        setShowTopupModal(true);
    };

    const handleTopupSubmit = async () => {
        if (!topupAmount || parseFloat(topupAmount) <= 0) {
            showError('Please enter a valid amount greater than 0', 'Invalid Amount');
            return;
        }

        setTopupLoading(true);
        try {
            const result = await walletService.adminTopupWallet({
                walletId: selectedWallet.id,
                userId: selectedWallet.userId,
                accountNumber: selectedWallet.accountNumber,
                amountAdd: parseFloat(topupAmount)
            });

            // Close topup modal
            setShowTopupModal(false);

            // Show success notification
            setNotificationData(result);
            setShowNotification(true);

            // Refresh wallets
            fetchWallets();
        } catch (error) {
            console.error('Topup failed:', error);
            // Show error notification
            setNotificationData({
                status: 'FAILED',
                message: error.response?.data?.message || 'Topup failed. Please try again.',
                walletId: selectedWallet.id,
                accountNumber: selectedWallet.accountNumber
            });
            setShowNotification(true);
        } finally {
            setTopupLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <SidebarAdmin />

            <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark h-screen overflow-y-auto w-full">
                <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">Wallet Management</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Admin</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-2"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </header>

                <div className="p-8 space-y-8 pb-20">
                    {/* FILTERS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                        <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
                            {/* SEARCH */}
                            <div className="flex-1">
                                <label className="block mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Search by ID, UserID, Account
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        search
                                    </span>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-12 pl-11 pr-4 focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                        placeholder="Enter ID, User ID or Account Number..."
                                        value={searchText}
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                            setCurrentPage(0);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* STATUS FILTER */}
                            {/* STATUS FILTER - Copy style từ phần không lỗi */}
                            <div className="space-y-1.5 w-full sm:w-48">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary h-10"
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(0);
                                    }}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="LOCKED">Locked / Frozen</option>
                                </select>
                            </div>
                        </div>
                        {/* RESET */}
                        <div className="flex items-end h-full pt-6">
                            <button
                                onClick={() => {
                                    setSearchText('');
                                    setStatusFilter('ALL');
                                    setCurrentPage(0);
                                }}
                                className="h-12 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Account Number</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">User ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Balance</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Created At</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500">Loading...</td>
                                        </tr>
                                    ) : currentWallets.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500">No wallets found matching your criteria.</td>
                                        </tr>
                                    ) : (
                                        currentWallets.map((wallet) => (
                                            <tr key={wallet.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 text-sm text-slate-500">{wallet.id}</td>
                                                <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-900 dark:text-slate-200">{wallet.accountNumber}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{wallet.userId}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-right text-slate-900 dark:text-white">
                                                    {formatCurrency(wallet.availableBalance)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(wallet.status)}`}>
                                                        {wallet.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {formatDate(wallet.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleTopupClick(wallet)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                                        >
                                                            Topup
                                                        </button>
                                                        <button
                                                            onClick={() => handleLockUnlock(wallet)}
                                                            className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none"
                                                            style={{
                                                                backgroundColor: isLocked(wallet.status) ? '#ef4444' : '#22c55e'
                                                            }}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isLocked(wallet.status) ? 'translate-x-1' : 'translate-x-6'
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination controls */}
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="px-3 py-1 rounded border disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm">Page {currentPage + 1} of {pageCount || 1}</span>
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage >= pageCount - 1}
                                className="px-3 py-1 rounded border disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Topup Modal */}
            {showTopupModal && selectedWallet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                        {/* Modal Header */}
                        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">account_balance_wallet</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Topup Wallet</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Add balance to wallet</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTopupModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Wallet Info */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Wallet ID:</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{selectedWallet.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Account Number:</span>
                                    <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{selectedWallet.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">User ID:</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{selectedWallet.userId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Balance:</span>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(selectedWallet.availableBalance)}</span>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Topup Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">₫</span>
                                    <input
                                        type="number"
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
                                        min="0"
                                        step="10000"
                                    />
                                </div>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="grid grid-cols-3 gap-2">
                                {[100000, 500000, 1000000].map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setTopupAmount(amount.toString())}
                                        className="px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        {formatCurrency(amount)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex gap-3">
                            <button
                                onClick={() => setShowTopupModal(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTopupSubmit}
                                disabled={topupLoading || !topupAmount || parseFloat(topupAmount) <= 0}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {topupLoading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                        Processing...
                                    </>
                                ) : (
                                    'Topup'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {showNotification && notificationData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                        {/* Notification Content */}
                        <div className="p-6 text-center space-y-4">
                            {/* Icon */}
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${notificationData.status === 'SUCCESS' || notificationData.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                                <span className={`material-symbols-outlined text-4xl ${notificationData.status === 'SUCCESS' || notificationData.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {notificationData.status === 'SUCCESS' || notificationData.status === 'COMPLETED' ? 'check_circle' : 'error'}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className={`text-xl font-bold ${notificationData.status === 'SUCCESS' || notificationData.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {notificationData.status === 'SUCCESS' || notificationData.status === 'COMPLETED' ? 'Topup Successful!' : 'Topup Failed'}
                            </h3>

                            {/* Message */}
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {notificationData.message}
                            </p>

                            {/* Details */}
                            {(notificationData.status === 'SUCCESS' || notificationData.status === 'COMPLETED') && (
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Amount Added:</span>
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400">+{formatCurrency(notificationData.amountAdded)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Previous Balance:</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(notificationData.previousBalance)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">New Balance:</span>
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(notificationData.newBalance)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4">
                            <button
                                onClick={() => setShowNotification(false)}
                                className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

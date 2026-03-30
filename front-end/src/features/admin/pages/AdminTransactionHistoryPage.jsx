import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionService from '../../wallet/api/transactionService';
import { useAuth } from '../../auth/context/AuthContext';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';

export default function AdminTransactionHistoryPage() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [displayedTransactions, setDisplayedTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [searchId, setSearchId] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [typeFilter, setTypeFilter] = useState('Tất cả loại');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Transaction Detail Modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [transactions, searchId, statusFilter, typeFilter]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionService.getAllAdminTransactions();

            // Ensure data is an array
            const txnList = Array.isArray(data) ? data : [];

            // Sort by Date DESC (newest first) if possible
            // Assuming createdAt is ISO string
            txnList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setTransactions(txnList);
        } catch (err) {
            console.error("Failed to fetch admin transactions", err);
            setError("Không thể tải lịch sử giao dịch.");
            // Set empty if fail
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...transactions];

        // Filter by Search ID (Transaction ID or Wallet ID)
        if (searchId.trim()) {
            const term = searchId.toLowerCase().trim();
            filtered = filtered.filter(t =>
                (t.transactionId && t.transactionId.toLowerCase().includes(term)) ||
                (t.walletId && t.walletId.toLowerCase().includes(term))
            );
        }

        // Filter by Status
        if (statusFilter !== 'Tất cả trạng thái') {
            const statusMap = {
                'Hoàn thành': 'COMPLETED',
                'Đang chờ': 'PENDING',
                'Thất bại': 'FAILED'
            };
            const targetStatus = statusMap[statusFilter] || statusFilter.toUpperCase();
            filtered = filtered.filter(t => t.status === targetStatus);
        }

        // Filter by Type
        if (typeFilter !== 'Tất cả loại') {
            const typeMap = {
                'Nạp tiền': 'DEPOSIT',
                'Rút tiền': 'WITHDRAW',
                'Nhận tiền': 'TRANSFER_IN', // Adjust if API returns different enum
                'Chuyển tiền': 'TRANSFER_OUT' // Adjust if API returns different enum
            };

            const targetKey = typeMap[typeFilter];
            if (targetKey) {
                filtered = filtered.filter(t => t.type === targetKey);
            }
        }

        setDisplayedTransactions(filtered);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const handleResetFilters = () => {
        setSearchId('');
        setStatusFilter('Tất cả trạng thái');
        setTypeFilter('Tất cả loại');
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = displayedTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedTransactions.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Helper for currency format
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper for date format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            case 'PENDING':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
            case 'FAILED':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-600 dark:bg-green-400';
            case 'PENDING':
                return 'bg-amber-600 dark:bg-amber-400';
            case 'FAILED':
                return 'bg-red-600 dark:bg-red-400';
            default:
                return 'bg-slate-600';
        }
    };

    const getTypeIcon = (type, amount) => {
        // Icon mapping
        if (type === 'DEPOSIT') return 'south_west'; // Money coming in
        if (type === 'WITHDRAW') return 'north_east'; // Money going out
        return 'sync_alt';
    };

    const getTypeColor = (type, amount) => {
        if (type === 'WITHDRAW') return 'text-red-500';
        if (type === 'DEPOSIT') return 'text-primary';
        return 'text-slate-400';
    };

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <SidebarAdmin />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
                <HeaderAdmin title="Lịch sử giao dịch" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                {/* Page Content */}
                    {/* Filter Section */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">filter_list</span>
                            <h4 className="text-slate-900 dark:text-white font-bold">Lọc giao dịch</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tìm kiếm ID</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                    <input
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary h-10"
                                        placeholder="ID Giao dịch hoặc Ví"
                                        type="text"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary h-10 text-slate-900 dark:text-slate-200"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option>Tất cả trạng thái</option>
                                    <option>Hoàn thành</option>
                                    <option>Đang chờ</option>
                                    <option>Thất bại</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Loại</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary h-10 text-slate-900 dark:text-slate-200"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option>Tất cả loại</option>
                                    <option>Nạp tiền</option>
                                    <option>Rút tiền</option>
                                    <option>Nhận tiền</option>
                                    <option>Chuyển tiền</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    className="flex-1 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors h-10"
                                    onClick={applyFilters}
                                >
                                    Áp dụng bộ lọc
                                </button>
                                <button
                                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 h-10 w-10 flex items-center justify-center"
                                    onClick={handleResetFilters}
                                >
                                    <span className="material-symbols-outlined">restart_alt</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">STT</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">ID Giao dịch</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">ID Ví</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Số tiền</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Loại</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Ngày tạo</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                    <span>Đang tải giao dịch...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                                Không tìm thấy giao dịch nào phù hợp.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((txn, index) => (
                                            <tr key={txn.transactionId || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-500 w-16">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-900 dark:text-slate-200">
                                                    {txn.transactionId}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {txn.walletId}
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-extrabold text-right ${txn.direction === 'OUT' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                    {txn.direction === 'OUT' ? '-' : '+'}{formatCurrency(Math.abs(txn.amount))}
                                                </td>
                                                 <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(txn.status)}`}>
                                                        <span className={`size-1.5 rounded-full ${getStatusDotColor(txn.status)}`}></span>
                                                        {txn.status === 'COMPLETED' ? 'Hoàn thành' : 
                                                         txn.status === 'PENDING' ? 'Đang chờ' : 
                                                         txn.status === 'FAILED' ? 'Thất bại' : txn.status}
                                                    </span>
                                                </td>
                                                 <td className="px-6 py-4">
                                                    <div className={`flex items-center gap-2 text-sm font-medium ${getTypeColor(txn.type, txn.amount)}`}>
                                                        <span className="material-symbols-outlined text-lg">{getTypeIcon(txn.type, txn.amount)}</span>
                                                        {txn.type === 'DEPOSIT' ? 'Nạp tiền' : 
                                                         txn.type === 'WITHDRAW' ? 'Rút tiền' : 
                                                         txn.type === 'TRANSFER_IN' ? 'Nhận tiền' : 
                                                         txn.type === 'TRANSFER_OUT' ? 'Chuyển tiền' : txn.type}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {formatDate(txn.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTransaction(txn);
                                                            setShowDetailModal(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                        <span>Chi tiết</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, displayedTransactions.length)} trên tổng số {displayedTransactions.length} kết quả
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>

                                {/* Simple Pagination Numbers */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Handle logic for displaying page numbers smartly if many pages (e.g., 1, 2, ... 10)
                                    // For simplicity in this iteration: show first 5 or sliding window
                                    let p = i + 1;
                                    if (totalPages > 5) {
                                        if (currentPage > 3) {
                                            p = currentPage - 2 + i;
                                        }
                                        if (p > totalPages) return null;
                                    }

                                    return (
                                        <button
                                            key={p}
                                            onClick={() => paginate(p)}
                                            className={`size-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${currentPage === p
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>

            {/* Transaction Detail Modal */}
            {showDetailModal && selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getStatusColor(selectedTransaction.status)}`}>
                                    <span className="material-symbols-outlined">receipt_long</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chi tiết giao dịch</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{selectedTransaction.transactionId}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl border-2 ${selectedTransaction.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : selectedTransaction.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-3xl ${selectedTransaction.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' : selectedTransaction.status === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {selectedTransaction.status === 'COMPLETED' ? 'check_circle' : selectedTransaction.status === 'PENDING' ? 'schedule' : 'cancel'}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Trạng thái giao dịch</p>
                                             <p className={`text-xl font-bold ${selectedTransaction.status === 'COMPLETED' ? 'text-green-700 dark:text-green-400' : selectedTransaction.status === 'PENDING' ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}>
                                                {selectedTransaction.status === 'COMPLETED' ? 'Hoàn thành' : 
                                                 selectedTransaction.status === 'PENDING' ? 'Đang chờ' : 
                                                 selectedTransaction.status === 'FAILED' ? 'Thất bại' : selectedTransaction.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Số tiền</p>
                                        <p className={`text-2xl font-extrabold ${selectedTransaction.direction === 'OUT' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {selectedTransaction.direction === 'OUT' ? '-' : '+'}{formatCurrency(Math.abs(selectedTransaction.amount))}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Information Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID Giao dịch</p>
                                    <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{selectedTransaction.transactionId}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID Tham chiếu</p>
                                    <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{selectedTransaction.referenceId || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID Ví</p>
                                    <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{selectedTransaction.walletId}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID Người dùng</p>
                                    <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{selectedTransaction.userId || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Loại giao dịch</p>
                                     <div className={`inline-flex items-center gap-2 text-sm font-medium ${getTypeColor(selectedTransaction.type, selectedTransaction.amount)}`}>
                                        <span className="material-symbols-outlined text-lg">{getTypeIcon(selectedTransaction.type, selectedTransaction.amount)}</span>
                                        <span>
                                            {selectedTransaction.type === 'DEPOSIT' ? 'Nạp tiền' : 
                                             selectedTransaction.type === 'WITHDRAW' ? 'Rút tiền' : 
                                             selectedTransaction.type === 'TRANSFER_IN' ? 'Nhận tiền' : 
                                             selectedTransaction.type === 'TRANSFER_OUT' ? 'Chuyển tiền' : selectedTransaction.type}
                                        </span>
                                    </div>
                                </div>
                                 <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chiều giao dịch</p>
                                    <p className={`text-sm font-bold ${selectedTransaction.direction === 'OUT' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {selectedTransaction.direction === 'OUT' ? 'CHI RA' : 'THU VÀO'}
                                    </p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tên đối tác</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedTransaction.partnerName || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ghi chú</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                        {selectedTransaction.note || 'Không có ghi chú'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày tạo</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(selectedTransaction.createdAt)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thành công</p>
                                    <p className={`text-sm font-bold ${selectedTransaction.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {selectedTransaction.success ? '✓ Có' : '✗ Không'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loanService from "../api/loanService";
import Sidebar from "../../../components/layout/Sidebar";
import { showError } from "../../../utils/swalUtils";

export default function LoanHistoryUser() {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    const fetchHistory = async (page = 0) => {
        setLoading(true);
        try {
            const [historyResponse, summaryResponse] = await Promise.all([
                loanService.getMyLoans(page, pagination.size),
                loanService.getLoanSummary()
            ]);

            setLoans(historyResponse.content || []);
            setSummary(summaryResponse);
            setPagination(prev => ({
                ...prev,
                page: historyResponse.number,
                totalPages: historyResponse.totalPages,
                totalElements: historyResponse.totalElements
            }));
        } catch (error) {
            console.error("Failed to fetch loan data:", error);
            showError("Lỗi", "Không thể lấy dữ liệu vay vốn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(0);
    }, []);

    const handleViewDetails = (loan) => {
        setSelectedLoan(loan);
        setShowModal(true);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PENDING_AI':
            case 'PENDING_ADMIN':
                return {
                    label: 'Đang chờ duyệt',
                    icon: status === 'PENDING_AI' ? 'automation' : 'person_search',
                    bg: 'bg-amber-50',
                    text: 'text-amber-600',
                    labelBg: 'bg-amber-100',
                    labelText: 'text-amber-700'
                };
            case 'APPROVED':
            case 'COMPLETED':
                return {
                    label: status === 'APPROVED' ? 'Đã duyệt' : 'Hoàn tất',
                    icon: status === 'COMPLETED' ? 'history_edu' : 'verified',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    labelBg: 'bg-emerald-100',
                    labelText: 'text-emerald-700'
                };
            case 'REJECTED':
                return {
                    label: 'Đã từ chối',
                    icon: 'error',
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    labelBg: 'bg-red-100',
                    labelText: 'text-red-700'
                };
            default:
                return {
                    label: 'Không xác định',
                    icon: 'help',
                    bg: 'bg-gray-50',
                    text: 'text-gray-500',
                    labelBg: 'bg-gray-100',
                    labelText: 'text-gray-600'
                };
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + " VND";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-100 font-body min-h-screen flex">
            <Sidebar activeRoute="loans_history" />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Main Content */}
                <main className="pt-12 min-h-screen">
                    <div className="max-w-6xl mx-auto px-8 py-12">
                        {/* Header Section */}
                        <div className="mb-12">
                            <h1 className="text-4xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight mb-2">Lịch sử vay vốn</h1>
                            <p className="text-on-surface-variant dark:text-slate-400 font-body">Theo dõi trạng thái và chi tiết các hồ sơ vay vốn của bạn qua các thời kỳ.</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : loans.length === 0 ? (
                            <div className="bg-surface-container-low dark:bg-slate-900 p-12 rounded-2xl text-center border-2 border-dashed border-outline-variant/30 dark:border-slate-800">
                                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">history_toggle_off</span>
                                <h3 className="text-xl font-bold text-on-surface dark:text-white mb-2">Chưa có lịch sử vay</h3>
                                <p className="text-on-surface-variant dark:text-slate-400 mb-6">Bạn chưa thực hiện khoản vay nào trên hệ thống.</p>
                                <button 
                                    onClick={() => navigate('/loans/apply')}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-all"
                                >
                                    Bắt đầu khoản vay đầu tiên
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Bento Layout for Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {loans.map((loan) => {
                                        const styles = getStatusStyles(loan.finalStatus);
                                        const isFraud = loan.adminNote?.includes("FRAUD ALERT");

                                        return (
                                            <div key={loan.id} className={`bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-6 shadow-[0_8px_24px_rgba(23,29,23,0.06)] hover:translate-y-[-4px] transition-transform duration-300 border border-gray-100 dark:border-slate-800 ${loan.finalStatus === 'REJECTED' ? 'border-l-4 border-emerald-500' : ''}`}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`${styles.bg} dark:bg-opacity-10 p-3 rounded-xl shadow-inner`}>
                                                        <span className={`material-symbols-outlined ${styles.text}`}>{styles.icon}</span>
                                                    </div>
                                                    <span className={`px-3 py-1 ${styles.labelBg} ${styles.labelText} text-[10px] font-bold rounded-full uppercase tracking-wider`}>
                                                        {styles.label}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 mb-6">
                                                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-label uppercase font-bold tracking-tight">Số tiền khoản vay</p>
                                                    <p className="text-2xl font-bold font-headline text-primary dark:text-emerald-400">{formatCurrency(loan.amount)}</p>
                                                </div>

                                                {isFraud && (
                                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg flex items-start gap-2">
                                                        <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                                                        <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase leading-tight">Fraud Detection Alert</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between py-4 border-t border-outline-variant/10 dark:border-slate-800">
                                                    <div>
                                                        <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase leading-tight">Ngày yêu cầu</p>
                                                        <p className="text-sm font-semibold text-on-surface dark:text-slate-200">{formatDate(loan.createdAt)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase leading-tight">Trạng thái</p>
                                                        <p className={`text-sm font-semibold ${styles.text}`}>{loan.statusDisplay}</p>
                                                    </div>
                                                </div>

                                                {loan.finalStatus === 'REJECTED' && loan.adminNote && !isFraud && (
                                                    <div className="mt-2 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900">
                                                        <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase mb-1">Lý do</p>
                                                        <p className="text-xs text-red-700 dark:text-red-300 italic line-clamp-2">{loan.adminNote}</p>
                                                    </div>
                                                )}

                                                <button 
                                                    onClick={() => handleViewDetails(loan)}
                                                    className={`w-full mt-4 py-3 rounded-lg text-sm font-bold transition-all active:scale-95 ${loan.finalStatus === 'APPROVED' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-surface-container-high dark:bg-slate-800 text-on-secondary-container dark:text-slate-300 hover:bg-surface-container-highest dark:hover:bg-slate-700'}`}
                                                >
                                                    Chi tiết hồ sơ
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {/* Traditional Decorative Bento Element (Static) */}
                                    <div className="bg-primary p-8 rounded-xl shadow-[0_8px_24px_rgba(0,109,55,0.1)] relative overflow-hidden flex flex-col justify-between">
                                        <div className="relative z-10">
                                            <h3 className="text-on-primary font-headline font-bold text-xl mb-2">Tỷ giá ưu đãi</h3>
                                            <p className="text-primary-fixed text-sm opacity-80 font-medium">Chỉ từ 6.5%/năm cho các khoản vay tín chấp.</p>
                                        </div>
                                        <div className="relative z-10 mt-8">
                                            <p className="text-4xl font-extrabold text-on-primary tracking-tighter">6.5%</p>
                                        </div>
                                        <div className="absolute -right-8 -bottom-8 opacity-10">
                                            <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
                                        {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => fetchHistory(idx)}
                                                className={`w-10 h-10 rounded-lg font-bold transition-all ${pagination.page === idx ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-on-surface dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                                            >
                                                {idx + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Summary Visualization */}
                                <section className="mt-12 bg-surface-container-low dark:bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-50 dark:border-slate-800">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-headline font-bold text-on-surface dark:text-white mb-2">Tổng quan tài chính</h2>
                                        <p className="text-on-surface-variant dark:text-slate-400 font-medium mb-6">
                                            Bạn đã thực hiện tổng cộng {summary?.totalLoans || 0} yêu cầu vay vốn. {summary?.descriptionText || "Hồ sơ đang được cập nhật."}
                                        </p>
                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary"></div>
                                                <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Đã giải ngân: {summary?.approvedLoans || 0}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full bg-tertiary shadow-sm shadow-tertiary"></div>
                                                <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Từ chối: {summary?.rejectedLoans || 0}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full bg-outline shadow-sm shadow-outline"></div>
                                                <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Đang chờ: {summary?.pendingAdminLoans || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-64">
                                        <div className="h-32 w-full bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group shadow-inner border border-emerald-50 dark:border-slate-700">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                                            <div className="text-center relative z-10">
                                                <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Score ({summary?.creditRating || "N/A"})</p>
                                                <p className="text-5xl font-extrabold text-primary dark:text-emerald-400 font-headline">
                                                    {Math.round((summary?.averageAiScore || 0) * 1000)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Loan Details Modal */}
            {showModal && selectedLoan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-extrabold font-headline text-on-surface dark:text-white">Chi tiết hồ sơ</h2>
                                <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">Hồ sơ #${selectedLoan.id} • {formatDate(selectedLoan.createdAt)}</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 rounded-full hover:bg-surface-container-high dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-on-surface dark:text-slate-400"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8">
                            {/* Key Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-primary/5 dark:bg-emerald-950/20 rounded-2xl p-6 border border-primary/10 dark:border-emerald-800/30">
                                    <p className="text-[10px] text-primary dark:text-emerald-400 font-bold uppercase tracking-widest mb-1">Số tiền vay</p>
                                    <p className="text-3xl font-extrabold text-primary dark:text-emerald-400 font-headline tracking-tighter">{formatCurrency(selectedLoan.amount)}</p>
                                </div>
                                <div className="bg-secondary-container/30 dark:bg-slate-800/40 rounded-2xl p-6 border border-secondary/10 dark:border-slate-700">
                                    <p className="text-[10px] text-secondary dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Kỳ hạn vay</p>
                                    <p className="text-3xl font-extrabold text-secondary dark:text-slate-300 font-headline tracking-tighter">{selectedLoan.term} tháng</p>
                                </div>
                            </div>

                            {/* Section: Purpose */}
                            <div>
                                <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-3">Mục đích vay vốn</h4>
                                <div className="bg-surface-container-low dark:bg-slate-800/50 p-4 rounded-xl border border-outline-variant/10 dark:border-slate-700">
                                    <p className="text-sm text-on-surface dark:text-slate-300 leading-relaxed font-medium">"{selectedLoan.purpose}"</p>
                                </div>
                            </div>

                            {/* Section: Financial Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                                <div>
                                    <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-4">Thông tin thu nhập</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-on-surface-variant dark:text-slate-400">Thu nhập khai báo:</span>
                                            <span className="text-sm font-bold text-on-surface dark:text-slate-200">{formatCurrency(selectedLoan.declaredIncome)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-on-surface-variant dark:text-slate-400">Phân khúc nghề nghiệp:</span>
                                            <span className="text-sm font-bold text-on-surface dark:text-slate-200">{selectedLoan.jobSegmentNum}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-4">Phân tích Hệ thống (AI)</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-on-surface-variant dark:text-slate-400">Điểm rủi ro (AI Score):</span>
                                            <span className={`text-sm font-bold ${selectedLoan.aiScore > 0.5 ? 'text-red-500' : 'text-primary dark:text-emerald-400'}`}>
                                                {(selectedLoan.aiScore * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-on-surface-variant dark:text-slate-400">Quyết định AI:</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${selectedLoan.aiDecision === 'PASSED_AI' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-950 text-red-600'}`}>
                                                {selectedLoan.aiDecision}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Admin Response */}
                            <div className="pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                                <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-4">Trạng thái & Phản hồi Admin</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-on-surface-variant dark:text-slate-400">Trạng thái hiện tại:</span>
                                        <span className={`text-sm font-bold ${getStatusStyles(selectedLoan.finalStatus).text}`}>
                                            {getStatusStyles(selectedLoan.finalStatus).label}
                                        </span>
                                    </div>
                                    {selectedLoan.adminNote && (
                                        <div className={`p-4 rounded-xl border ${selectedLoan.adminNote.includes('FRAUD') ? 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900 text-red-700 dark:text-red-400' : 'bg-surface-container-high dark:bg-slate-800 border-outline-variant/10 dark:border-slate-700 text-on-surface-variant dark:text-slate-400'}`}>
                                            <p className="text-[10px] font-bold uppercase mb-1 opacity-70">Ghi chú từ Admin:</p>
                                            <p className="text-xs italic leading-relaxed">
                                                {selectedLoan.adminNote}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-surface-container-low/50 dark:bg-slate-900/50 border-t border-outline-variant/10 dark:border-slate-800 flex justify-end">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-8 py-3 rounded-xl bg-on-surface dark:bg-primary text-surface dark:text-white font-bold active:scale-95 transition-all text-white"
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

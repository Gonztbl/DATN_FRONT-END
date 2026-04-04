import React, { useState, useEffect, useCallback } from 'react';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import adminLoanService from '../api/adminLoanService';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0);

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const getInitials = (name = '') =>
    name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

/** aiScore từ backend là 0‒1 (e.g. 0.3 = 30%) */
const getRiskLevel = (aiScore) => {
    if (aiScore >= 0.3) return 'high';     // match backend: highRiskCount = aiScore >= 0.3
    if (aiScore >= 0.1) return 'moderate';
    return 'low';
};

const RISK_STYLES = {
    high:     { dot: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',    badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
    moderate: { dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    low:      { dot: 'bg-primary',    text: 'text-primary dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
};

// ─── Loan Detail Modal ───────────────────────────────────────────────────────

function LoanDetailModal({ loanId, onClose, onActionDone }) {
    const [detail, setDetail] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [mode, setMode] = useState(null); // 'approve' | 'reject'
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('loan'); // 'loan' | 'ai'

    useEffect(() => {
        setLoading(true);
        // Bước 1: lấy loan detail trước để có userId
        adminLoanService.getLoanDetail(loanId)
            .then(async (r) => {
                const loanData = r.data;
                setDetail(loanData);
                // Bước 2: song song gọi AI analysis với userId
                if (loanData?.userId) {
                    try {
                        const aiRes = await adminLoanService.getUserAiAnalysis(loanData.userId);
                        setAiAnalysis(aiRes.data);
                    } catch {
                        // AI analysis không bắt buộc, không block modal
                    }
                }
            })
            .catch(() => setError('Không thể tải chi tiết khoản vay.'))
            .finally(() => setLoading(false));
    }, [loanId]);

    const handleAction = async () => {
        if (mode === 'reject' && !adminNote.trim()) {
            setError('Vui lòng nhập lý do từ chối.');
            return;
        }
        setActionLoading(true);
        setError('');
        try {
            if (mode === 'approve') {
                await adminLoanService.approveLoan(loanId, adminNote);
            } else {
                await adminLoanService.rejectLoan(loanId, adminNote);
            }
            onActionDone(mode);
            onClose();
        } catch (e) {
            setError(e?.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.');
        } finally {
            setActionLoading(false);
        }
    };

    const risk = detail ? getRiskLevel(detail.aiScore) : 'low';
    const rs = RISK_STYLES[risk];

    // spendIncomeRatio từ loan detail là 0-1, từ aiAnalysis là 0-100
    const spendRatioPct = aiAnalysis
        ? (aiAnalysis.spendIncomeRatio ?? 0)           // đã là %
        : (detail?.spendIncomeRatio ?? 0) * 100;       // convert từ 0-1
    const rejectedRatioPct = aiAnalysis
        ? (aiAnalysis.rejectedTransactionRatio ?? 0)   // đã là %
        : (detail?.rejectedTransactionRatio ?? 0) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-primary dark:text-emerald-400">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chi tiết đơn vay #{loanId}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{detail?.fullName ?? '...'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-400">close</span>
                    </button>
                </div>

                {/* Tabs */}
                {!loading && detail && (
                    <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
                        <button
                            onClick={() => setActiveTab('loan')}
                            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'loan' ? 'border-primary text-primary dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-base align-middle mr-1">description</span>
                            Thông tin khoản vay
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'ai' ? 'border-primary text-primary dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-base align-middle">psychology</span>
                            Phân tích AI
                            {aiAnalysis && <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>}
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-5">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {!loading && error && !detail && (
                        <p className="text-center text-red-500 py-12">{error}</p>
                    )}

                    {/* ── Tab: Loan Info ── */}
                    {!loading && detail && activeTab === 'loan' && (
                        <>
                            {/* AI Score Banner */}
                            <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${risk === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : risk === 'moderate' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-3xl ${rs.text}`}>
                                        {risk === 'high' ? 'warning' : risk === 'moderate' ? 'info' : 'verified_user'}
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Điểm rủi ro AI</p>
                                        <p className={`text-2xl font-extrabold ${rs.text}`}>{(detail.aiScore * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Số tiền vay</p>
                                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(detail.amount)}</p>
                                </div>
                            </div>

                            {/* Fraud Alert */}
                            {detail.adminNote && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 mt-0.5">gpp_bad</span>
                                    <div>
                                        <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Cảnh báo hệ thống</p>
                                        <p className="text-sm text-red-600 dark:text-red-400">{detail.adminNote}</p>
                                    </div>
                                </div>
                            )}

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Thông tin khoản vay</p>
                                    <InfoRow label="Mục đích" value={detail.purpose} />
                                    <InfoRow label="Kỳ hạn" value={`${detail.term} tháng`} />
                                    <InfoRow label="Thu nhập khai báo" value={formatCurrency(detail.declaredIncome)} />
                                    <InfoRow label="Nghề nghiệp" value={detail.jobSegmentNum} />
                                    <InfoRow label="Ngày tạo" value={formatDate(detail.loanCreatedAt)} />
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Thông tin khách hàng</p>
                                    <InfoRow label="Họ tên" value={detail.fullName} />
                                    <InfoRow label="SĐT" value={detail.phone} />
                                    <InfoRow label="Email" value={detail.email} />
                                    <InfoRow label="KYC Level" value={`Cấp ${detail.kycLevel}`} />
                                    <InfoRow label="Số dư ví" value={formatCurrency(detail.walletBalance)} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Tab: AI Analysis ── */}
                    {!loading && detail && activeTab === 'ai' && (
                        <>
                            {!aiAnalysis ? (
                                <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-400 dark:text-slate-500">
                                    <span className="material-symbols-outlined text-4xl opacity-40">analytics</span>
                                    <p className="text-sm">Không thể tải dữ liệu phân tích AI.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Income Verification */}
                                    {(() => {
                                        const declared = detail.declaredIncome ?? 0;
                                        const actual = aiAnalysis.monthlyInflowMean ?? 0;
                                        const mismatch = declared > 0 ? Math.abs(declared - actual) / declared * 100 : 0;
                                        const isFraud = mismatch > 50;
                                        return (
                                            <div className={`p-4 rounded-xl border-2 ${isFraud ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`material-symbols-outlined ${isFraud ? 'text-red-600' : 'text-primary dark:text-emerald-400'}`}>
                                                        {isFraud ? 'gpp_bad' : 'verified'}
                                                    </span>
                                                    <p className={`font-bold text-sm ${isFraud ? 'text-red-700 dark:text-red-400' : 'text-emerald-800 dark:text-emerald-300'}`}>
                                                        {isFraud ? `⚠️ Thu nhập không khớp (lệch ${mismatch.toFixed(0)}%)` : '✅ Thu nhập xác minh bình thường'}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-3">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Thu nhập khai báo</p>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{formatCurrency(declared)}</p>
                                                    </div>
                                                    <div className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-3">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Dòng tiền vào thực tế/tháng</p>
                                                        <p className={`font-bold text-sm mt-0.5 ${isFraud ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{formatCurrency(actual)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Wallet Metrics */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Thông tin ví</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <StatCard label="Số dư ví" value={formatCurrency(aiAnalysis.walletBalance)} />
                                            <StatCard label="Số dư khả dụng" value={formatCurrency(aiAnalysis.availableBalance)} />
                                            <StatCard label="Số dư trung bình" value={formatCurrency(aiAnalysis.avgBalance)} />
                                            <StatCard label="Inflow lớn nhất" value={formatCurrency(aiAnalysis.largestInflow)} />
                                        </div>
                                    </div>

                                    {/* Cash Flow */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Dòng tiền (90 ngày gần nhất)</p>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                            <div className="flex gap-4 mb-3">
                                                <div className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Tiền vào TB/tháng</p>
                                                    <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(aiAnalysis.monthlyInflowMean)}</p>
                                                </div>
                                                <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Tiền ra TB/tháng</p>
                                                    <p className="text-base font-bold text-red-600 dark:text-red-400">{formatCurrency(aiAnalysis.monthlyOutflowMean)}</p>
                                                </div>
                                            </div>
                                            {/* Spend ratio bar */}
                                            <div>
                                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                    <span>Tỷ lệ chi/thu</span>
                                                    <span className={`font-bold ${spendRatioPct > 80 ? 'text-red-600' : spendRatioPct > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{spendRatioPct.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${spendRatioPct > 80 ? 'bg-red-500' : spendRatioPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min(spendRatioPct, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk Indicators */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Chỉ số rủi ro</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <StatCard
                                                label="Số giao dịch (90ng)"
                                                value={aiAnalysis.transactionCount}
                                            />
                                            <StatCard
                                                label="Tuổi tài khoản"
                                                value={`${aiAnalysis.accountAgeDays} ngày`}
                                                highlight={aiAnalysis.accountAgeDays < 90}
                                            />
                                            <StatCard
                                                label="GD bị từ chối"
                                                value={`${rejectedRatioPct.toFixed(1)}%`}
                                                highlight={rejectedRatioPct > 5}
                                            />
                                            <StatCard
                                                label="Ngày số dư thấp"
                                                value={`${(aiAnalysis.lowBalanceDaysRatio ?? 0).toFixed(1)}%`}
                                                highlight={(aiAnalysis.lowBalanceDaysRatio ?? 0) > 30}
                                            />
                                            <StatCard
                                                label="Độ biến động số dư"
                                                value={formatCurrency(aiAnalysis.balanceVolatility)}
                                            />
                                            <StatCard
                                                label="Peer transfer"
                                                value={`${(aiAnalysis.peerTransferRatio ?? 0).toFixed(1)}%`}
                                            />
                                        </div>
                                    </div>

                                    {/* Profile */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Hồ sơ cá nhân</p>
                                            <InfoRow label="Tuổi" value={`${aiAnalysis.age ?? '—'} tuổi`} />
                                            <InfoRow label="Người nhận khác nhau" value={aiAnalysis.uniqueReceivers} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Liên hệ</p>
                                            <InfoRow label="Email" value={aiAnalysis.email} />
                                            <InfoRow label="SĐT" value={aiAnalysis.phone} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ── Action Area (both tabs) ── */}
                    {!loading && detail && (
                        <>
                            {!mode && (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setMode('approve')}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Duyệt khoản vay
                                    </button>
                                    <button
                                        onClick={() => setMode('reject')}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">cancel</span>
                                        Từ chối
                                    </button>
                                </div>
                            )}

                            {mode && (
                                <div className={`p-4 rounded-xl border-2 ${mode === 'approve' ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10' : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'}`}>
                                    <p className="text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                        {mode === 'approve' ? '✅ Ghi chú duyệt (tùy chọn)' : '❌ Lý do từ chối (bắt buộc)'}
                                    </p>
                                    <textarea
                                        value={adminNote}
                                        onChange={e => setAdminNote(e.target.value)}
                                        placeholder={mode === 'approve' ? 'Duyệt khoản vay - Hồ sơ hợp lệ' : 'Nhập lý do từ chối...'}
                                        rows={3}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                    />
                                    {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleAction}
                                            disabled={actionLoading}
                                            className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 text-white ${mode === 'approve' ? 'bg-primary hover:bg-primary/90' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-60`}
                                        >
                                            {actionLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : null}
                                            {mode === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                                        </button>
                                        <button
                                            onClick={() => { setMode(null); setAdminNote(''); setError(''); }}
                                            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            Huỷ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 text-right">{value ?? '—'}</span>
        </div>
    );
}

function StatCard({ label, value, highlight }) {
    return (
        <div className={`p-3 rounded-lg ${highlight ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{label}</p>
            <p className={`text-sm font-bold ${highlight ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-200'}`}>{value}</p>
        </div>
    );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border font-semibold text-sm transition-all ${type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'}`}>
            <span className="material-symbols-outlined text-lg">{type === 'success' ? 'check_circle' : 'error'}</span>
            {msg}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminListLoans() {
    // Stats
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // Loans list
    const [loans, setLoans] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Filters & pagination
    const [keyword, setKeyword] = useState('');
    const [riskFilter, setRiskFilter] = useState('all'); // 'all' | 'low' | 'moderate' | 'high'
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 10;

    // Detail modal
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    // Toast
    const [toast, setToast] = useState(null);

    // ── Fetch Stats ──
    useEffect(() => {
        setStatsLoading(true);
        adminLoanService.getDashboardStats()
            .then(r => setStats(r.data))
            .catch(() => {})
            .finally(() => setStatsLoading(false));
    }, []);

    // ── Fetch List ──
    const fetchLoans = useCallback(() => {
        setLoading(true);
        const params = {
            page,
            size: PAGE_SIZE,
            sort: 'createdAt,desc',
        };
        if (keyword.trim()) params.keyword = keyword.trim();
        if (riskFilter === 'low') { params.minAiScore = 0; params.maxAiScore = 0.1; }
        if (riskFilter === 'moderate') { params.minAiScore = 0.1; params.maxAiScore = 0.3; }
        if (riskFilter === 'high') { params.minAiScore = 0.3; params.maxAiScore = 1; }

        adminLoanService.getPendingLoans(params)
            .then(r => {
                setLoans(r.data.content || []);
                setTotalElements(r.data.totalElements || 0);
                setTotalPages(r.data.totalPages || 1);
            })
            .catch(() => setLoans([]))
            .finally(() => setLoading(false));
    }, [page, keyword, riskFilter]);

    useEffect(() => { fetchLoans(); }, [fetchLoans]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchLoans();
    };

    const handleActionDone = (mode) => {
        setToast({ msg: mode === 'approve' ? 'Đã duyệt khoản vay thành công!' : 'Đã từ chối khoản vay.', type: mode === 'approve' ? 'success' : 'error' });
        // Refresh both stats & list
        adminLoanService.getDashboardStats().then(r => setStats(r.data)).catch(() => {});
        fetchLoans();
    };

    // Computed risk distribution for bar - chỉ hiển thị thống kê thuần, không suy ra quyết định
    const total = (stats?.highRiskCount ?? 0) + (stats?.moderateRiskCount ?? 0) + (stats?.lowRiskCount ?? 0) || 1;
    const lowPct = Math.round(((stats?.lowRiskCount ?? 0) / total) * 100);
    const modPct = Math.round(((stats?.moderateRiskCount ?? 0) / total) * 100);
    const hiPct = 100 - lowPct - modPct;
    // highRiskPct = % đơn rủi ro cao (chỉ để vẽ vòng tròn cảnh báo)
    const highRiskPct = Math.round(((stats?.highRiskCount ?? 0) / total) * 100);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
                .font-manrope { font-family: 'Manrope', sans-serif; }
            `}</style>

            <SidebarAdmin />

            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
                <HeaderAdmin title="Đơn vay vốn" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                        {/* Page Title Row */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-manrope font-extrabold text-slate-900 dark:text-white tracking-tight">Duyệt đơn vay vốn</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Xem xét và phê duyệt các hồ sơ vay đang chờ.</p>
                            </div>
                        </div>

                        {/* Stats Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                            <StatBento
                                icon="pending_actions" iconBg="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-primary dark:text-emerald-400"
                                label="Chờ duyệt" value={statsLoading ? '…' : (stats?.totalPending ?? '—')}
                            />
                            <StatBento
                                icon="warning" iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-600 dark:text-red-400"
                                label="Rủi ro cao" value={statsLoading ? '…' : (stats?.highRiskCount ?? '—')}
                                borderColor="border-l-4 border-red-500" badge="Action Required" badgeColor="text-red-600"
                            />
                            <StatBento
                                icon="info" iconBg="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400"
                                label="Rủi ro trung bình" value={statsLoading ? '…' : (stats?.moderateRiskCount ?? '—')}
                                borderColor="border-l-4 border-amber-400"
                            />
                            <StatBento
                                icon="verified_user" iconBg="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-primary dark:text-emerald-400"
                                label="Rủi ro thấp" value={statsLoading ? '…' : (stats?.lowRiskCount ?? '—')}
                                borderColor="border-l-4 border-primary"
                            />
                            <StatBento
                                icon="payments" iconBg="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-primary dark:text-emerald-400"
                                label="Số tiền TB"
                                value={statsLoading ? '…' : (stats?.averageAmount ? `${(stats.averageAmount / 1_000_000).toFixed(1)}M` : '—')}
                                unit="VND"
                            />
                        </div>

                        {/* Filter Bar */}
                        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-center">
                            <div className="relative flex-1 min-w-[220px]">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                                    placeholder="Tìm theo tên, SĐT..."
                                    className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-10 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-200"
                                />
                            </div>
                            <select
                                value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setPage(0); }}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-10 px-3 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Tất cả rủi ro</option>
                                <option value="low">Thấp (&lt;10%)</option>
                                <option value="moderate">Trung bình (10-30%)</option>
                                <option value="high">Cao (&gt;30%)</option>
                            </select>
                            <button type="submit" className="bg-primary text-white px-5 h-10 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                                Tìm kiếm
                            </button>
                            <button type="button" onClick={() => { setKeyword(''); setRiskFilter('all'); setPage(0); }} className="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-symbols-outlined">restart_alt</span>
                            </button>
                        </form>

                        {/* Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="px-6 py-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Hiển thị <span className="text-slate-900 dark:text-white">{loans.length}</span> / <span className="text-slate-900 dark:text-white">{totalElements}</span> đơn
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Khách hàng</th>
                                            <th className="px-6 py-4">Số tiền vay</th>
                                            <th className="px-6 py-4">Thời gian</th>
                                            <th className="px-6 py-4">AI Score</th>
                                            <th className="px-6 py-4">Trạng thái</th>
                                            <th className="px-6 py-4 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-14 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                        <span className="text-slate-400 text-sm">Đang tải...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : loans.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-14 text-center text-slate-400 dark:text-slate-500">
                                                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">inbox</span>
                                                    Không có đơn vay nào phù hợp.
                                                </td>
                                            </tr>
                                        ) : (
                                            loans.map((loan) => {
                                                const risk = getRiskLevel(loan.aiScore);
                                                const rs = RISK_STYLES[risk];
                                                return (
                                                    <tr key={loan.loanId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-bold text-primary dark:text-emerald-400">#{loan.loanId}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-bold text-primary dark:text-emerald-400 shrink-0">
                                                                    {getInitials(loan.fullName)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{loan.fullName}</p>
                                                                    <p className="text-xs text-slate-400 dark:text-slate-500">ID: {loan.userId}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(loan.amount)}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(loan.createdAt)}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full shrink-0 ${rs.dot}`}></span>
                                                                <span className={`text-sm font-bold ${rs.text}`}>{(loan.aiScore * 100).toFixed(1)}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                                                                Chờ duyệt
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => setSelectedLoanId(loan.loanId)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-primary dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-base">visibility</span>
                                                                Xem xét
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Trang {page + 1} / {totalPages}
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const p = page <= 2 ? i : page - 2 + i;
                                        if (p >= totalPages) return null;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`size-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === p ? 'bg-primary text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                                            >
                                                {p + 1}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-emerald-800 to-primary text-white p-8 rounded-2xl relative overflow-hidden shadow-lg">
                                <div className="relative z-10">
                                    <h4 className="text-xl font-manrope font-bold mb-3">Tổng kết thống kê</h4>
                                    <p className="text-emerald-200/70 text-xs uppercase tracking-wider mb-1">Tổng đơn chờ duyệt</p>
                                    <p className="text-4xl font-extrabold font-manrope mb-5">{statsLoading ? '…' : (stats?.totalPending ?? '—')}</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white/10 rounded-xl p-3 text-center">
                                            <span className="text-lg">🔴</span>
                                            <p className="text-2xl font-extrabold mt-1">{statsLoading ? '…' : (stats?.highRiskCount ?? 0)}</p>
                                            <p className="text-emerald-200/60 text-[10px] uppercase tracking-wider mt-0.5">Cao &gt;30%</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-3 text-center">
                                            <span className="text-lg">🟡</span>
                                            <p className="text-2xl font-extrabold mt-1">{statsLoading ? '…' : (stats?.moderateRiskCount ?? 0)}</p>
                                            <p className="text-emerald-200/60 text-[10px] uppercase tracking-wider mt-0.5">TB 10-30%</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-3 text-center">
                                            <span className="text-lg">🟢</span>
                                            <p className="text-2xl font-extrabold mt-1">{statsLoading ? '…' : (stats?.lowRiskCount ?? 0)}</p>
                                            <p className="text-emerald-200/60 text-[10px] uppercase tracking-wider mt-0.5">Thấp &lt;10%</p>
                                        </div>
                                    </div>
                                    <p className="text-emerald-50/50 text-xs mt-4">*Quyết định duyệt/từ chối do admin xem xét trực tiếp</p>
                                </div>
                                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-12">verified</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl flex items-center gap-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex-1">
                                    <h4 className="text-xl font-manrope font-bold text-slate-900 dark:text-white mb-4">Phân bố rủi ro</h4>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${lowPct}%` }}></div>
                                        <div className="h-full bg-amber-500 transition-all" style={{ width: `${modPct}%` }}></div>
                                        <div className="h-full bg-red-500 transition-all" style={{ width: `${hiPct}%` }}></div>
                                    </div>
                                    <div className="flex justify-between mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Thấp ({lowPct}%)</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> TB ({modPct}%)</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Cao ({hiPct}%)</span>
                                    </div>
                                </div>
                                <div className="w-24 h-24 rounded-full flex items-center justify-center relative shrink-0">
                                    <div className="text-center z-10">
                                        <span className={ `text-xl font-extrabold ${highRiskPct > 0 ? 'text-red-500' : 'text-primary dark:text-emerald-400'}` }>
                                            {highRiskPct}<span className="text-xs">%</span>
                                        </span>
                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">rủi ro cao</p>
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="48" cy="48" fill="none" r="40"
                                            stroke="currentColor"
                                            className="text-slate-200 dark:text-slate-700"
                                            strokeDasharray="251.2"
                                            strokeDashoffset="0"
                                            strokeWidth="8" />
                                        <circle cx="48" cy="48" fill="none" r="40"
                                            stroke="currentColor"
                                            className={ highRiskPct > 0 ? 'text-red-500' : 'text-primary dark:text-emerald-400' }
                                            strokeDasharray="251.2"
                                            strokeDashoffset={251.2 - (251.2 * highRiskPct / 100)}
                                            strokeWidth="8" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Detail Modal */}
            {selectedLoanId && (
                <LoanDetailModal
                    loanId={selectedLoanId}
                    onClose={() => setSelectedLoanId(null)}
                    onActionDone={handleActionDone}
                />
            )}

            {/* Toast */}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ─── StatBento sub-component ─────────────────────────────────────────────────

function StatBento({ icon, iconBg, iconColor, label, value, unit, borderColor = '', badge, badgeColor }) {
    return (
        <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 ${borderColor}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {badge && <span className={`text-xs font-bold ${badgeColor}`}>{badge}</span>}
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="text-3xl font-manrope font-extrabold text-slate-900 dark:text-white mt-1">
                {value}{unit && <span className="text-lg font-medium text-slate-400 dark:text-slate-500 ml-1">{unit}</span>}
            </h3>
        </div>
    );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import adminLoanService from '../api/adminLoanService';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);
const fmtDate = (s) => s ? new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const initials = (name = '') => name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
const riskLevel = (s) => s >= 0.3 ? 'high' : s >= 0.1 ? 'moderate' : 'low';

const RISK_STYLE = {
    high:     { dot: 'bg-red-500',     text: 'text-red-600 dark:text-red-400' },
    moderate: { dot: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400' },
    low:      { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
};

const STATUS_CFG = {
    PENDING_ADMIN: { label: 'Chờ duyệt',   badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',       dot: 'bg-amber-500',   icon: 'pending_actions' },
    APPROVED:      { label: 'Đã duyệt',    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', icon: 'check_circle' },
    REJECTED:      { label: 'Đã từ chối', badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',                dot: 'bg-red-500',     icon: 'cancel' },
};
const getS = (k) => STATUS_CFG[k] ?? { label: k ?? '—', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', dot: 'bg-slate-400', icon: 'circle' };

const STATUS_TABS = [
    { key: 'all',          label: 'Tất cả',      icon: 'list' },
    { key: 'PENDING_ADMIN', label: 'Chờ duyệt',   icon: 'pending_actions' },
    { key: 'APPROVED',     label: 'Đã duyệt',    icon: 'check_circle' },
    { key: 'REJECTED',     label: 'Đã từ chối',  icon: 'cancel' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 text-right">{value ?? '—'}</span>
        </div>
    );
}

function MiniCard({ label, value, highlight }) {
    return (
        <div className={`p-3 rounded-lg border ${highlight ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{label}</p>
            <p className={`text-sm font-bold ${highlight ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-200'}`}>{value}</p>
        </div>
    );
}

function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border font-semibold text-sm ${type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'}`}>
            <span className="material-symbols-outlined text-lg">{type === 'success' ? 'check_circle' : 'error'}</span>
            {msg}
        </div>
    );
}

// ─── Loan Detail Modal ────────────────────────────────────────────────────────
function LoanDetailModal({ loanId, onClose, onApproveReject }) {
    const [detail, setDetail]     = useState(null);
    const [aiData, setAiData]     = useState(null);
    const [loading, setLoading]   = useState(true);
    const [tab, setTab]           = useState('loan');
    const [err, setErr]           = useState('');
    const [mode, setMode]         = useState(null);   // 'approve' | 'reject'
    const [note, setNote]         = useState('');
    const [acting, setActing]     = useState(false);
    const [actErr, setActErr]     = useState('');

    useEffect(() => {
        setLoading(true);
        adminLoanService.getLoanDetail(loanId)
            .then(async (r) => {
                setDetail(r.data);
                if (r.data?.userId) {
                    try { const ar = await adminLoanService.getUserAiAnalysis(r.data.userId); setAiData(ar.data); } catch {}
                }
            })
            .catch(() => setErr('Không thể tải chi tiết khoản vay.'))
            .finally(() => setLoading(false));
    }, [loanId]);

    const handleAction = async () => {
        if (mode === 'reject' && !note.trim()) { setActErr('Vui lòng nhập lý do từ chối.'); return; }
        setActing(true); setActErr('');
        try {
            if (mode === 'approve') await adminLoanService.approveLoan(loanId, note);
            else await adminLoanService.rejectLoan(loanId, note);
            onApproveReject(mode);
            onClose();
        } catch (e) {
            setActErr(e?.response?.data?.message || 'Thao tác thất bại.');
        } finally { setActing(false); }
    };

    const risk = detail ? riskLevel(detail.aiScore) : 'low';
    const rs   = RISK_STYLE[risk];
    const sc   = detail ? getS(detail.finalStatus) : null;
    const isPending = detail?.finalStatus === 'PENDING_ADMIN';

    const spendPct    = aiData ? (aiData.spendIncomeRatio ?? 0) : (detail?.spendIncomeRatio ?? 0) * 100;
    const rejPct      = aiData ? (aiData.rejectedTransactionRatio ?? 0) : (detail?.rejectedTransactionRatio ?? 0) * 100;

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
                    <div className="flex items-center gap-2">
                        {sc && <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${sc.badge}`}>{sc.label}</span>}
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {!loading && detail && (
                    <div className="flex border-b border-slate-200 dark:border-slate-800 px-6">
                        {[{ k: 'loan', icon: 'description', label: 'Thông tin' }, { k: 'ai', icon: 'psychology', label: 'Phân tích AI' }].map(({ k, icon, label }) => (
                            <button key={k} onClick={() => setTab(k)}
                                className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${tab === k ? 'border-primary text-primary dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                <span className="material-symbols-outlined text-base">{icon}</span>{label}
                                {k === 'ai' && aiData && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-5">
                    {loading && <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}
                    {!loading && err && !detail && <p className="text-center text-red-500 py-12">{err}</p>}

                    {/* Loan Tab */}
                    {!loading && detail && tab === 'loan' && (
                        <>
                            {/* Score banner */}
                            <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${risk === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : risk === 'moderate' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-3xl ${rs.text}`}>{risk === 'high' ? 'warning' : risk === 'moderate' ? 'info' : 'verified_user'}</span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Điểm rủi ro AI</p>
                                        <p className={`text-2xl font-extrabold ${rs.text}`}>{(detail.aiScore * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Số tiền vay</p>
                                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{fmt(detail.amount)}</p>
                                </div>
                            </div>

                            {/* Admin note */}
                            {detail.adminNote && (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                                    <span className="material-symbols-outlined text-amber-600 mt-0.5">sticky_note_2</span>
                                    <div>
                                        <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">Ghi chú Admin</p>
                                        <p className="text-sm text-amber-600 dark:text-amber-400">{detail.adminNote}</p>
                                    </div>
                                </div>
                            )}

                            {/* Info grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Thông tin khoản vay</p>
                                    <InfoRow label="Mục đích"          value={detail.purpose} />
                                    <InfoRow label="Kỳ hạn"            value={`${detail.term} tháng`} />
                                    <InfoRow label="Thu nhập khai báo" value={fmt(detail.declaredIncome)} />
                                    <InfoRow label="Nghề nghiệp"       value={detail.jobSegmentNum} />
                                    <InfoRow label="Ngày tạo"          value={fmtDate(detail.loanCreatedAt)} />
                                    <InfoRow label="AI Decision"       value={detail.aiDecision} />
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Thông tin khách hàng</p>
                                    <InfoRow label="Họ tên"    value={detail.fullName} />
                                    <InfoRow label="SĐT"       value={detail.phone} />
                                    <InfoRow label="Email"     value={detail.email} />
                                    <InfoRow label="KYC Level" value={`Cấp ${detail.kycLevel}`} />
                                    <InfoRow label="Số dư ví"  value={fmt(detail.walletBalance)} />
                                </div>
                            </div>

                            {/* Approve / Reject (only for PENDING_ADMIN) */}
                            {isPending && (
                                <>
                                    {!mode && (
                                        <div className="flex gap-3 pt-1">
                                            <button onClick={() => setMode('approve')} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                                <span className="material-symbols-outlined">check_circle</span>Duyệt khoản vay
                                            </button>
                                            <button onClick={() => setMode('reject')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                                <span className="material-symbols-outlined">cancel</span>Từ chối
                                            </button>
                                        </div>
                                    )}
                                    {mode && (
                                        <div className={`p-4 rounded-xl border-2 ${mode === 'approve' ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10' : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'}`}>
                                            <p className="text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                                {mode === 'approve' ? '✅ Ghi chú duyệt (tùy chọn)' : '❌ Lý do từ chối (bắt buộc)'}
                                            </p>
                                            <textarea value={note} onChange={e => setNote(e.target.value)}
                                                placeholder={mode === 'approve' ? 'Duyệt khoản vay - Hồ sơ hợp lệ' : 'Nhập lý do từ chối...'}
                                                rows={3} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary resize-none" />
                                            {actErr && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{actErr}</p>}
                                            <div className="flex gap-2 mt-3">
                                                <button onClick={handleAction} disabled={acting}
                                                    className={`flex-1 font-bold py-2.5 rounded-xl text-sm text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${mode === 'approve' ? 'bg-primary hover:bg-primary/90' : 'bg-red-600 hover:bg-red-700'}`}>
                                                    {acting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                                    {mode === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                                                </button>
                                                <button onClick={() => { setMode(null); setNote(''); setActErr(''); }}
                                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                    Huỷ
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* AI Tab */}
                    {!loading && detail && tab === 'ai' && (
                        <>
                            {!aiData ? (
                                <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl opacity-40">analytics</span>
                                    <p className="text-sm">Không có dữ liệu phân tích AI.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Income check */}
                                    {(() => {
                                        const declared = detail.declaredIncome ?? 0;
                                        const actual   = aiData.monthlyInflowMean ?? 0;
                                        const mm       = declared > 0 ? Math.abs(declared - actual) / declared * 100 : 0;
                                        const fraud    = mm > 50;
                                        return (
                                            <div className={`p-4 rounded-xl border-2 ${fraud ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`material-symbols-outlined ${fraud ? 'text-red-600' : 'text-primary dark:text-emerald-400'}`}>{fraud ? 'gpp_bad' : 'verified'}</span>
                                                    <p className={`font-bold text-sm ${fraud ? 'text-red-700 dark:text-red-400' : 'text-emerald-800 dark:text-emerald-300'}`}>
                                                        {fraud ? `⚠️ Thu nhập không khớp (lệch ${mm.toFixed(0)}%)` : '✅ Thu nhập xác minh bình thường'}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-3">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Thu nhập khai báo</p>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{fmt(declared)}</p>
                                                    </div>
                                                    <div className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-3">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Dòng tiền vào TB/tháng</p>
                                                        <p className={`font-bold text-sm mt-0.5 ${fraud ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{fmt(actual)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Wallet */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Thông tin ví</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <MiniCard label="Số dư ví"          value={fmt(aiData.walletBalance)} />
                                            <MiniCard label="Số dư khả dụng"    value={fmt(aiData.availableBalance)} />
                                            <MiniCard label="Số dư trung bình"  value={fmt(aiData.avgBalance)} />
                                            <MiniCard label="Inflow lớn nhất"   value={fmt(aiData.largestInflow)} />
                                        </div>
                                    </div>

                                    {/* Cash flow */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Dòng tiền (90 ngày)</p>
                                        <div className="flex gap-4 mb-3">
                                            <div className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
                                                <p className="text-xs text-slate-500">Tiền vào TB/tháng</p>
                                                <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">{fmt(aiData.monthlyInflowMean)}</p>
                                            </div>
                                            <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                                <p className="text-xs text-slate-500">Tiền ra TB/tháng</p>
                                                <p className="text-base font-bold text-red-600 dark:text-red-400">{fmt(aiData.monthlyOutflowMean)}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Tỷ lệ chi/thu</span>
                                            <span className={`font-bold ${spendPct > 80 ? 'text-red-600' : spendPct > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{spendPct.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${spendPct > 80 ? 'bg-red-500' : spendPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(spendPct, 100)}%` }} />
                                        </div>
                                    </div>

                                    {/* Risk indicators */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Chỉ số rủi ro</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <MiniCard label="Số giao dịch (90ng)"  value={aiData.transactionCount} />
                                            <MiniCard label="Tuổi tài khoản"       value={`${aiData.accountAgeDays} ngày`} highlight={aiData.accountAgeDays < 90} />
                                            <MiniCard label="GD bị từ chối"        value={`${rejPct.toFixed(1)}%`} highlight={rejPct > 5} />
                                            <MiniCard label="Ngày số dư thấp"      value={`${(aiData.lowBalanceDaysRatio ?? 0).toFixed(1)}%`} highlight={(aiData.lowBalanceDaysRatio ?? 0) > 30} />
                                            <MiniCard label="Biến động số dư"      value={fmt(aiData.balanceVolatility)} />
                                            <MiniCard label="Peer transfer"         value={`${(aiData.peerTransferRatio ?? 0).toFixed(1)}%`} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Chart: Số đơn theo thứ trong tuần ──────────────────────────────────────
function DailyLoanChart({ loans }) {
    const now        = new Date();
    const year       = now.getFullYear();
    const month      = now.getMonth();
    const monthLabel = now.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
    const todayDow   = now.getDay(); // 0=CN, 1=T2...6=T7

    // Thứ trong tuần: T2(1)→T7(6)→CN(0) → index 0..6
    const DOW_LABELS  = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const DOW_FULL    = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    // mapDow: JS getDay() → index 0-6 (T2=0 ... CN=6)
    const jsToIdx = (d) => d === 0 ? 6 : d - 1;
    const todayIdx = jsToIdx(todayDow);

    // Đếm số đơn theo thứ trong tháng
    const dowCounts = Array(7).fill(0);
    loans.forEach(loan => {
        if (!loan.createdAt) return;
        const d = new Date(loan.createdAt);
        if (d.getFullYear() === year && d.getMonth() === month) {
            dowCounts[jsToIdx(d.getDay())]++;
        }
    });

    const maxVal = Math.max(...dowCounts, 1);
    const total  = dowCounts.reduce((a, b) => a + b, 0);
    const H      = 90;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Đơn vay theo thứ</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 capitalize">{monthLabel}</p>
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Tổng tháng: <span className="text-slate-900 dark:text-white font-extrabold">{total}</span> đơn
                </div>
            </div>

            {/* Bars */}
            <div className="flex items-end gap-2" style={{ height: H + 32 }}>
                {/* Y labels */}
                <div className="flex flex-col justify-between text-[9px] text-slate-400 dark:text-slate-600 font-mono shrink-0 pb-6" style={{ height: H + 8 }}>
                    <span>{maxVal}</span>
                    <span>{Math.round(maxVal / 2)}</span>
                    <span>0</span>
                </div>

                {/* 7 cột */}
                {dowCounts.map((cnt, i) => {
                    const barH      = cnt === 0 ? 3 : Math.max(6, Math.round((cnt / maxVal) * H));
                    const isToday   = i === todayIdx;
                    const pct       = total > 0 ? Math.round((cnt / total) * 100) : 0;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${DOW_FULL[i]}: ${cnt} đơn (${pct}%)`}>
                            {/* Value label */}
                            <span className={`text-[10px] font-extrabold tabular-nums ${isToday ? 'text-primary dark:text-emerald-400' : (cnt === 0 ? 'text-slate-300 dark:text-slate-700' : 'text-slate-600 dark:text-slate-300')}`}>
                                {cnt > 0 ? cnt : ''}
                            </span>
                            {/* Bar */}
                            <div className="w-full flex items-end rounded-t-sm overflow-hidden" style={{ height: H }}>
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 ${
                                        isToday
                                            ? 'bg-primary dark:bg-emerald-500'
                                            : cnt === 0
                                                ? 'bg-slate-100 dark:bg-slate-800'
                                                : 'bg-emerald-300 dark:bg-emerald-700'
                                    }`}
                                    style={{ height: barH }}
                                />
                            </div>
                            {/* Weekday label */}
                            <span className={`text-[10px] font-bold ${isToday ? 'text-primary dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                {DOW_LABELS[i]}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary dark:bg-emerald-500 inline-block"></span> Hôm nay ({DOW_LABELS[todayIdx]})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-300 dark:bg-emerald-700 inline-block"></span> Các ngày khác</span>
            </div>
        </div>
    );
}

// ─── Chart: Phân bố rủi ro 3 cột ─────────────────────────────────────────────
function RiskDistChart({ stats, statsLoading }) {
    const high = stats?.highRiskCount    ?? 0;
    const mod  = stats?.moderateRiskCount ?? 0;
    const low  = stats?.lowRiskCount     ?? 0;
    const maxV = Math.max(high, mod, low, 1);

    const bars = [
        { label: 'Rủi ro cao', value: high, color: 'bg-red-500',     textColor: 'text-red-600 dark:text-red-400',     desc: 'AI Score ≥ 30%' },
        { label: 'Rủi ro TB',  value: mod,  color: 'bg-amber-400',   textColor: 'text-amber-600 dark:text-amber-400', desc: '10% – 30%' },
        { label: 'Rủi ro thấp', value: low, color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', desc: 'AI Score < 10%' },
    ];
    const total = high + mod + low || 1;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Phân bố rủi ro</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Dựa trên AI Score – đơn chờ duyệt</p>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {statsLoading ? '…' : `${high + mod + low} đơn`}
                </span>
            </div>

            {/* 3 bars side by side */}
            {statsLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
            ) : (
                <>
                    <div className="flex items-end gap-4 h-28 mb-3">
                        {bars.map(({ label, value, color, textColor }) => {
                            const pct = Math.round((value / total) * 100);
                            const heightPct = Math.max(value === 0 ? 3 : 8, Math.round((value / maxV) * 100));
                            return (
                                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                                    <span className={`text-xs font-extrabold ${textColor}`}>{value}</span>
                                    <div className="w-full flex items-end" style={{ height: 88 }}>
                                        <div
                                            className={`w-full rounded-t-lg ${color} transition-all duration-500`}
                                            style={{ height: `${heightPct}%`, minHeight: 4 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Labels + % */}
                    <div className="flex gap-4">
                        {bars.map(({ label, value, color, desc }) => {
                            const pct = Math.round((value / total) * 100);
                            return (
                                <div key={label} className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                        <span className={`w-2 h-2 rounded-sm ${color} inline-block`}></span>
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{label}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500">{desc}</p>
                                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{pct}%</p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="bg-red-500 h-full transition-all"     style={{ width: `${Math.round((high / total) * 100)}%` }} />
                        <div className="bg-amber-400 h-full transition-all"   style={{ width: `${Math.round((mod  / total) * 100)}%` }} />
                        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${Math.round((low  / total) * 100)}%` }} />
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminAllLoans() {
    // List state
    const [loans, setLoans]               = useState([]);
    const [totalElements, setTotal]       = useState(0);
    const [totalPages, setTotalPages]     = useState(1);
    const [loading, setLoading]           = useState(true);

    // Filters
    const [keyword, setKeyword]           = useState('');
    const [statusFilter, setStatus]       = useState('all');
    const [riskFilter, setRisk]           = useState('all');
    const [page, setPage]                 = useState(0);
    const PAGE_SIZE = 10;

    // Stats (from /stats API — counts pending only)
    const [stats, setStats]               = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // Status counts (totalElements per status, fetched in parallel)
    const [counts, setCounts]             = useState({});
    const [countsLoading, setCountsLoading] = useState(true);

    // Modal & Toast
    const [selectedId, setSelectedId]     = useState(null);
    const [toast, setToast]               = useState(null);

    // Chart data
    const [chartLoans, setChartLoans]     = useState([]);

    // ── Fetch stats (dashboard stats API) ──
    useEffect(() => {
        setStatsLoading(true);
        adminLoanService.getDashboardStats()
            .then(r => setStats(r.data))
            .catch(() => {})
            .finally(() => setStatsLoading(false));
    }, []);

    // ── Fetch counts per status (5 parallel calls, size=1 just for totalElements) ──
    const fetchCounts = useCallback(() => {
        setCountsLoading(true);
        const statuses = ['PENDING_ADMIN', 'APPROVED', 'REJECTED'];
        Promise.all(
            statuses.map(s => adminLoanService.getAllLoans({ page: 0, size: 1, status: s }).then(r => ({ s, n: r.data.totalElements || 0 })).catch(() => ({ s, n: 0 })))
        ).then(results => {
            const map = {};
            results.forEach(({ s, n }) => { map[s] = n; });
            setCounts(map);
        }).finally(() => setCountsLoading(false));
    }, []);

    useEffect(() => { fetchCounts(); }, [fetchCounts]);

    // ── Fetch chart data (100 loans mới nhất để vẽ biểu đồ) ──
    useEffect(() => {
        adminLoanService.getAllLoans({ page: 0, size: 100, sort: 'createdAt,desc' })
            .then(r => setChartLoans(r.data.content || []))
            .catch(() => {});
    }, []);

    // ── Fetch list ──
    const fetchLoans = useCallback(() => {
        setLoading(true);
        const params = { page, size: PAGE_SIZE, sort: 'createdAt,desc' };
        if (keyword.trim())        params.keyword     = keyword.trim();
        if (statusFilter !== 'all') params.status     = statusFilter;
        if (riskFilter === 'low')      { params.minAiScore = 0;   params.maxAiScore = 0.1; }
        if (riskFilter === 'moderate') { params.minAiScore = 0.1; params.maxAiScore = 0.3; }
        if (riskFilter === 'high')     { params.minAiScore = 0.3; params.maxAiScore = 1;   }

        adminLoanService.getAllLoans(params)
            .then(r => {
                setLoans(r.data.content || []);
                setTotal(r.data.totalElements || 0);
                setTotalPages(r.data.totalPages || 1);
            })
            .catch(() => setLoans([]))
            .finally(() => setLoading(false));
    }, [page, keyword, statusFilter, riskFilter]);

    useEffect(() => { fetchLoans(); }, [fetchLoans]);

    const handleSearch = (e) => { e.preventDefault(); setPage(0); };
    const handleStatusTab = (key) => { setStatus(key); setPage(0); };

    const handleApproveReject = (mode) => {
        setToast({ msg: mode === 'approve' ? 'Đã duyệt khoản vay!' : 'Đã từ chối khoản vay.', type: mode === 'approve' ? 'success' : 'error' });
        fetchLoans();
        fetchCounts();
        // Refresh stats
        adminLoanService.getDashboardStats().then(r => setStats(r.data)).catch(() => {});
    };

    // computed
    const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap'); .font-manrope{font-family:'Manrope',sans-serif}`}</style>
            <SidebarAdmin />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <HeaderAdmin title="Tất cả đơn vay" />
                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                        {/* Title row */}
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-manrope font-extrabold text-slate-900 dark:text-white tracking-tight">Toàn bộ đơn vay</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Xem tất cả đơn vay trong hệ thống theo mọi trạng thái.</p>
                            </div>
                            <Link to="/admin/loans"
                                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                                <span className="material-symbols-outlined text-base">pending_actions</span>
                                Xem đơn chờ duyệt
                                {!countsLoading && counts['PENDING_ADMIN'] > 0 && (
                                    <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs font-extrabold">{counts['PENDING_ADMIN']}</span>
                                )}
                            </Link>
                        </div>

                        {/* Stats from /stats API */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { icon: 'pending_actions', bg: 'bg-amber-100 dark:bg-amber-900/30',   color: 'text-amber-600 dark:text-amber-400',    label: 'Chờ duyệt',      value: statsLoading ? '…' : (stats?.totalPending ?? '—') },
                                { icon: 'warning',         bg: 'bg-red-100 dark:bg-red-900/30',       color: 'text-red-600 dark:text-red-400',        label: 'Rủi ro cao',     value: statsLoading ? '…' : (stats?.highRiskCount ?? '—') },
                                { icon: 'info',            bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400',  label: 'Rủi ro TB',      value: statsLoading ? '…' : (stats?.moderateRiskCount ?? '—') },
                                { icon: 'verified_user',   bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-primary dark:text-emerald-400',  label: 'Rủi ro thấp',    value: statsLoading ? '…' : (stats?.lowRiskCount ?? '—') },
                                { icon: 'payments',        bg: 'bg-blue-100 dark:bg-blue-900/30',     color: 'text-blue-600 dark:text-blue-400',      label: 'Số tiền vay TB', value: statsLoading ? '…' : (stats?.averageAmount ? `${(stats.averageAmount / 1_000_000).toFixed(1)}M` : '—'), unit: 'VND' },
                            ].map(({ icon, bg, color, label, value, unit }) => (
                                <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                                    <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center ${color} mb-3`}>
                                        <span className="material-symbols-outlined">{icon}</span>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value} {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}</p>
                                </div>
                            ))}
                        </div>

                        {/* ── Charts Row ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Chart 1: Số đơn theo ngày trong tháng */}
                            <DailyLoanChart loans={chartLoans} />
                            {/* Chart 2: Phân bố rủi ro */}
                            <RiskDistChart stats={stats} statsLoading={statsLoading} />
                        </div>

                        {/* Status tabs + filters */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="px-4 pt-4 pb-0 flex flex-wrap gap-1">
                                {STATUS_TABS.map(({ key, label, icon }) => {
                                    const active = statusFilter === key;
                                    const count  = key === 'all' ? (countsLoading ? null : totalAll) : (countsLoading ? null : counts[key]);
                                    const dotCls = STATUS_CFG[key]?.dot ?? '';
                                    return (
                                        <button key={key} onClick={() => handleStatusTab(key)}
                                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${active ? 'border-primary text-primary dark:text-emerald-400 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                            <span className="material-symbols-outlined text-base">{icon}</span>
                                            {label}
                                            {count !== null && (
                                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${active ? 'bg-primary/10 text-primary dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{count}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800"></div>

                            {/* Filter bar */}
                            <form onSubmit={handleSearch} className="p-4 flex flex-wrap gap-3 items-center">
                                <div className="relative flex-1 min-w-[220px]">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                    <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                                        placeholder="Tìm theo tên, SĐT..."
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-10 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-200" />
                                </div>
                                <select value={riskFilter} onChange={e => { setRisk(e.target.value); setPage(0); }}
                                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-10 px-3 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary">
                                    <option value="all">Tất cả rủi ro</option>
                                    <option value="low">Thấp (&lt;10%)</option>
                                    <option value="moderate">Trung bình (10–30%)</option>
                                    <option value="high">Cao (&gt;30%)</option>
                                </select>
                                <button type="submit" className="bg-primary text-white px-5 h-10 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Tìm kiếm</button>
                                <button type="button" onClick={() => { setKeyword(''); setRisk('all'); setPage(0); }}
                                    className="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined">restart_alt</span>
                                </button>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="px-6 py-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Hiển thị <span className="text-slate-900 dark:text-white">{loans.length}</span> / <span className="text-slate-900 dark:text-white">{totalElements}</span> đơn
                                </p>
                                {statusFilter !== 'all' && (
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getS(statusFilter).badge}`}>{getS(statusFilter).label}</span>
                                )}
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
                                            <tr><td colSpan="7" className="px-6 py-14 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                    <span className="text-slate-400 text-sm">Đang tải...</span>
                                                </div>
                                            </td></tr>
                                        ) : loans.length === 0 ? (
                                            <tr><td colSpan="7" className="px-6 py-14 text-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">inbox</span>
                                                Không có đơn vay nào phù hợp.
                                            </td></tr>
                                        ) : loans.map((loan) => {
                                            const rl  = riskLevel(loan.aiScore);
                                            const rs  = RISK_STYLE[rl];
                                            const sc  = getS(loan.finalStatus);
                                            return (
                                                <tr key={loan.loanId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-bold text-primary dark:text-emerald-400">#{loan.loanId}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-bold text-primary dark:text-emerald-400 shrink-0">
                                                                {initials(loan.fullName)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{loan.fullName}</p>
                                                                <p className="text-xs text-slate-400">ID: {loan.userId}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{fmt(loan.amount)}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{fmtDate(loan.createdAt)}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full shrink-0 ${rs.dot}`}></span>
                                                            <span className={`text-sm font-bold ${rs.text}`}>{(loan.aiScore * 100).toFixed(1)}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${sc.badge}`}>{sc.label}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => setSelectedId(loan.loanId)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-primary dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                                                            <span className="material-symbols-outlined text-base">visibility</span>Chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Trang {page + 1} / {totalPages}</p>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                                        className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const p = page <= 2 ? i : page - 2 + i;
                                        if (p >= totalPages) return null;
                                        return (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`size-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === p ? 'bg-primary text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                                {p + 1}
                                            </button>
                                        );
                                    })}
                                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                                        className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status summary tiles */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                                <button key={key} onClick={() => handleStatusTab(key)}
                                    className={`bg-white dark:bg-slate-900 border rounded-xl p-4 text-left hover:shadow-md transition-all ${statusFilter === key ? 'border-primary dark:border-emerald-500 shadow-sm ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-800'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-base">{cfg.icon}</span>
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{cfg.label}</p>
                                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                                        {countsLoading ? <span className="text-slate-300 dark:text-slate-600">…</span> : (counts[key] ?? 0)}
                                    </p>
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </main>

            {selectedId && (
                <LoanDetailModal
                    loanId={selectedId}
                    onClose={() => setSelectedId(null)}
                    onApproveReject={handleApproveReject}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

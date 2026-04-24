import React, { useState, useEffect, useCallback } from 'react';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import fraudAdminService from '../api/fraudAdminService';

// Helpers
const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);
const fmtDate = (s) => s ? new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const initials = (name = '') => (name || '').substring(0, 2).toUpperCase();

const ZONE_CFG = {
    ACCEPT: { label: 'CHẤP NHẬN', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    REVIEW: { label: 'XEM XÉT', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    REJECT: { label: 'TỪ CHỐI', dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
};
const getZ = (k) => ZONE_CFG[k] ?? { label: k ?? '—', dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' };

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 text-right">{value ?? '—'}</span>
        </div>
    );
}

// Modal Chi Tiết
function FraudAlertDetailModal({ id, onClose }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        setLoading(true);
        fraudAdminService.getFraudAlertDetail(id)
            .then(res => setDetail(res.data || res))
            .catch(e => setErr('Không thể tải dữ liệu chi tiết'))
            .finally(() => setLoading(false));
    }, [id]);

    const zsc = detail ? getZ(detail.fraudZone) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined">security</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chi tiết cảnh báo #{id}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{detail?.userName ?? '...'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-400">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {loading && <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}
                    {!loading && err && !detail && <p className="text-center text-red-500 py-12">{err}</p>}

                    {!loading && detail && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Thông tin chung</p>
                                    <InfoRow label="ID Người dùng" value={detail.userId} />
                                    <InfoRow label="Họ tên (Username)" value={detail.userName} />
                                    <InfoRow label="Số tiền yêu cầu" value={fmt(detail.amount)} />
                                    <InfoRow label="Tài khoản nhận" value={detail.toAccountNumber} />
                                    <InfoRow label="Ngày tạo" value={fmtDate(detail.createdAt)} />
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Kết quả AI</p>
                                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="text-sm font-bold text-slate-500">Điểm AI</span>
                                        <span className={`text-xl font-black ${zsc.text}`}>{(detail.fraudScore * 100).toFixed(2)}%</span>
                                    </div>
                                    <InfoRow label="Vùng Rủi ro" value={<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${zsc.badge}`}>{zsc.label}</span>} />
                                    <InfoRow label="Xác thực khuôn mặt" value={detail.faceVerified ? '🟢 Thành công' : '🔴 Trống / Thất bại'} />
                                    <InfoRow label="Trạng thái cuối" value={<span className="font-bold text-slate-700 dark:text-slate-300">{detail.finalStatus}</span>} />
                                    <InfoRow label="Ghi chú" value={detail.note} />
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Các Thông số đầu vào Model (13 Features)</p>
                                {detail.modelInputFeatures ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {Object.entries(detail.modelInputFeatures).map(([key, val]) => (
                                            <div key={key} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between">
                                                <span className="text-[10px] font-bold uppercase text-slate-400 break-words">{key}</span>
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{(typeof val === 'number') ? parseFloat(val).toFixed(3) : val}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Không tìm thấy dữ liệu features lưu trữ.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminFraudAlertPage() {
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [filterZone, setFilterZone] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const PAGE_SIZE = 10;

    useEffect(() => {
        setStatsLoading(true);
        fraudAdminService.getFraudStats()
            .then(res => setStats(res.data || res))
            .catch(console.error)
            .finally(() => setStatsLoading(false));
    }, []);

    const fetchAlerts = useCallback(() => {
        setLoading(true);
        const params = { page, size: PAGE_SIZE };
        if (filterZone !== 'all') params.zone = filterZone;
        if (filterStatus !== 'all') params.finalStatus = filterStatus;
        if (searchTerm.trim()) params.keyword = searchTerm.trim();

        fraudAdminService.getFraudAlerts(params)
            .then(res => {
                const data = res.data || res;
                if (data.content) {
                    setAlerts(data.content);
                    setTotalPages(data.totalPages);
                    setTotalElements(data.totalElements);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, filterZone, filterStatus, searchTerm]);

    useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex">
            <SidebarAdmin />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <HeaderAdmin title="Cảnh báo Gian lận (AI Fraud)" />
                <div className="p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                        {/* Title row */}
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cảnh báo Gian lận AI</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Giám sát các giao dịch chuyển tiền bị hệ thống AI đánh dấu nghi ngờ.</p>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Tổng số cảnh báo', value: stats?.totalAlerts ?? 0, icon: 'warning', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                                { label: 'Cần Review (Face ID)', value: stats?.totalReview ?? 0, icon: 'face', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                                { label: 'Giao dịch Bị chặn', value: stats?.totalBlocked ?? 0, icon: 'block', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
                                { label: 'Cảnh báo 7 ngày', value: stats?.alertsLast7Days ?? 0, icon: 'calendar_today', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
                            ].map((s, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
                                    <div className={`p-4 rounded-xl ${s.bg} ${s.color}`}>
                                        <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                                        <p className="text-2xl font-black mt-1">
                                            {statsLoading ? '...' : s.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Table & Filters */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <h3 className="font-bold text-lg">Danh sách Cảnh báo</h3>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Search Box */}
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                            <input
                                                type="text"
                                                placeholder="Tìm User ID, Tên..."
                                                value={searchTerm}
                                                onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                                                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64"
                                            />
                                        </div>

                                        {/* Filters */}
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={filterZone}
                                                onChange={e => { setFilterZone(e.target.value); setPage(0); }}
                                                className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2 font-semibold focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="all">Tất cả </option>
                                                <option value="ACCEPT">CHẤP NHẬN</option>
                                                <option value="REVIEW">XEM XÉT</option>
                                                <option value="REJECT">TỪ CHỐI</option>
                                            </select>

                                            <select
                                                value={filterStatus}
                                                onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
                                                className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2 font-semibold focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="all">Tất cả Trạng thái</option>
                                                <option value="PENDING">ĐANG CHỜ</option>
                                                <option value="COMPLETED">THÀNH CÔNG</option>
                                                <option value="BLOCKED">BỊ CHẶN</option>
                                            </select>

                                            <button
                                                onClick={() => { setFilterZone('all'); setFilterStatus('all'); setSearchTerm(''); setPage(0); }}
                                                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
                                                title="Làm mới bộ lọc"
                                            >
                                                <span className="material-symbols-outlined text-sm">restart_alt</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-6 py-4">Mã số</th>
                                            <th className="px-6 py-4">Người dùng</th>
                                            <th className="px-6 py-4">Số tiền</th>
                                            <th className="px-6 py-4">Chỉ số rủi ro</th>
                                            <th className="px-6 py-4">Hành động</th>
                                            <th className="px-6 py-4">Trạng thái cuối</th>
                                            <th className="px-6 py-4 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {loading ? (
                                            <tr><td colSpan="7" className="px-6 py-14 text-center">Đang tải...</td></tr>
                                        ) : alerts.length === 0 ? (
                                            <tr><td colSpan="7" className="px-6 py-14 text-center text-slate-400">Không có dữ liệu.</td></tr>
                                        ) : alerts.map(item => {
                                            const zsc = getZ(item.fraudZone);
                                            return (
                                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="px-6 py-4 text-sm font-bold opacity-60">#{item.id}</td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold">{item.userName}</p>
                                                        <p className="text-xs text-slate-500">ID: {item.userId}</p>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold">{fmt(item.amount)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font-black ${zsc.text}`}>{(item.fraudScore * 100).toFixed(1)}%</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${zsc.badge}`}>{zsc.label}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium">{item.finalStatus}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => setSelectedId(item.id)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold transition">
                                                            Xem
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                                <p className="text-slate-500">Trang {page + 1} / {totalPages}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Trang trước</button>
                                    <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Trang sau</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {selectedId && <FraudAlertDetailModal id={selectedId} onClose={() => setSelectedId(null)} />}
        </div>
    );
}

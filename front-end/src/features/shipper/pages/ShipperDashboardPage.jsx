import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';

const ShipperDashboardPage = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('week');

    const stats = [
        { label: 'Tổng đơn giao', value: '320', trend: '+5.2%', icon: 'package_2', color: 'primary' },
        { label: 'Quãng đường', value: '1,240', unit: 'km', trend: '+3.1%', icon: 'distance', color: 'blue-500' },
        { label: 'Doanh thu', value: '0', unit: 'đ', trend: '0%', icon: 'payments', color: 'amber-500' },
        { label: 'Đơn hôm nay', value: '12', trend: '+10%', icon: 'today', color: 'primary' }
    ];

    const chartData = [
        { day: 'T2', height: '65%' },
        { day: 'T3', height: '40%' },
        { day: 'T4', height: '85%' },
        { day: 'T5', height: '55%' },
        { day: 'T6', height: '95%', active: true },
        { day: 'T7', height: '30%' },
        { day: 'CN', height: '20%' }
    ];

    const recentHistory = [
        { id: 'SP-44021', time: 'Hôm nay, 14:30', amount: '0 đ', status: 'Hoàn thành' },
        { id: 'SP-44019', time: 'Hôm nay, 11:15', amount: '0 đ', status: 'Hoàn thành' },
        { id: 'SP-43988', time: 'Hôm qua, 18:02', amount: '0 đ', status: 'Hoàn thành' },
        { id: 'SP-43950', time: '21 Th05, 09:45', amount: '0 đ', status: 'Hoàn thành' },
        { id: 'SP-43942', time: '21 Th05, 08:20', amount: '0 đ', status: 'Hoàn thành' }
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <HeaderShipper title="Tổng quan" />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 pb-24">
                    {/* Hero Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Thống kê của tôi</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Theo dõi hiệu suất giao hàng và doanh thu của bạn.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-slate-400 ml-2">calendar_today</span>
                            <select 
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="form-select border-none bg-transparent text-slate-900 dark:text-white font-semibold focus:ring-0 cursor-pointer pr-10 outline-none"
                            >
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                                <option value="year">Năm 2024</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 bg-${stat.color === 'primary' ? 'primary/10' : stat.color + '/10'} rounded-lg text-${stat.color}`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <span className={`text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend === '0%' ? 'text-slate-400 bg-slate-50 dark:bg-slate-800' : ''}`}>
                                        {stat.trend !== '0%' && <span className="material-symbols-outlined text-sm">trending_up</span>} {stat.trend}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {stat.value} {stat.unit && <span className="text-lg font-bold text-slate-400">{stat.unit}</span>}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Bar Chart Section */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Khối lượng giao hàng</h3>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                        <span className="size-2 bg-primary rounded-full"></span> Thành công
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-64 flex items-end justify-between gap-2 px-2">
                                {chartData.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1 group">
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-48 overflow-hidden">
                                            <div 
                                                className={`absolute bottom-0 w-full transition-all ${item.active ? 'bg-primary' : 'bg-primary/40 group-hover:bg-primary'}`} 
                                                style={{ height: item.height }}
                                            ></div>
                                        </div>
                                        <span className={`mt-3 text-xs font-bold ${item.active ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                            {item.day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent History Section */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Lịch sử gần đây</h3>
                                <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {recentHistory.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-xl">check_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">#{item.id}</p>
                                                <p className="text-xs text-slate-500 font-medium">{item.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.amount}</p>
                                            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider font-display">{item.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/shipper/orders')}
                                className="mt-6 w-full py-4 bg-primary text-background-dark font-black uppercase italic tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Giao đơn mới</span>
                                <span className="material-symbols-outlined">double_arrow</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Bottom Navigation */}
                <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
                    <button 
                        className="flex flex-col items-center gap-1 text-primary"
                        onClick={() => navigate('/shipper/dashboard')}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-[10px] font-bold uppercase">Tổng quan</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400"
                        onClick={() => navigate('/shipper/orders')}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold uppercase">Đơn hàng</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400"
                        onClick={() => navigate('/shipper/profile')}
                    >
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-bold uppercase">Cá nhân</span>
                    </button>
                </footer>
            </div>
            {/* Map Decoration */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-5 dark:opacity-10 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgpX98VtBQEMkbfogqup1t_7AgpSVBaYbtYxuCk_kKHpbEj_r8zI--8r6ckNm6hrkYp3mJixJWogdHqD2X3oMhWICCyIuOiIDLPY40_qmlHcxNPcox7qi2lIyssotFjBy_jZw15Vk-Vs7pbDt4aT9xHbwv1Yi4Djv7XUQjHFkO-VP5pbcE7mClwmj3z2S-_Z4Cg7V-FrJK9MHXj2lDCb7kg0URBQ_0WaQ9VUtB35BODxtJgq-p17uhte6JW5pLfn1QWOKzXbVW5IjQ')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
    );
};

export default ShipperDashboardPage;

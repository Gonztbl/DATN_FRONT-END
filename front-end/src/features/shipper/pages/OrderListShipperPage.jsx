import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';

const OrderListShipperPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PENDING');

    const orders = [
        {
            id: 'SPF-9281',
            status: 'PENDING',
            time: '15:30',
            distance: '2.5km',
            customer: 'Nguyễn Văn A',
            phone: '0903 123 456',
            address: '123 Lê Lợi, Q.1, HCM',
            total: '145.000đ',
            items: 2
        },
        {
            id: 'SPF-8842',
            status: 'DELIVERING',
            time: '15:15',
            distance: '4.2km',
            customer: 'Trần Thị B',
            phone: '0908 987 654',
            address: '45 Nguyễn Huệ, Q.1, HCM',
            total: '230.000đ',
            items: 3
        },
        {
            id: 'SPF-7521',
            status: 'COMPLETED',
            time: '14:45',
            customer: 'Lê Văn C',
            address: '789 CMT8, Q.10, HCM',
            completedTime: '15:10'
        }
    ];

    const tabs = [
        { id: 'PENDING', label: 'Chờ nhận', icon: 'notifications_active' },
        { id: 'DELIVERING', label: 'Đang giao', icon: 'motorcycle' },
        { id: 'COMPLETED', label: 'Đã giao', icon: 'check_circle' },
        { id: 'FAILED', label: 'Thất bại', icon: 'cancel' }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-200">Chờ nhận</span>;
            case 'DELIVERING': return <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">Đang giao</span>;
            case 'COMPLETED': return <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">Đã giao</span>;
            case 'FAILED': return <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-200">Thất bại</span>;
            default: return null;
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="flex h-full grow flex-col">
                {/* Header Section */}
                <HeaderShipper title="Đơn hàng của tôi" />

                {/* Status Tabs */}
                <nav className="sticky top-[73px] z-40 bg-white dark:bg-slate-900 px-4 shadow-sm">
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center border-b-2 px-4 py-3 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                <span className="text-xs font-semibold mt-1 whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Order List */}
                <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
                    <div className="space-y-4">
                        {orders.filter(o => o.status === activeTab).map((order) => (
                            <div key={order.id} className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-4 transition-all hover:shadow-md">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">#{order.id}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            <span>{order.time}</span>
                                            {order.distance && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <span className="material-symbols-outlined text-sm">near_me</span>
                                                    <span>{order.distance}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                {order.status === 'COMPLETED' ? (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Đơn hàng hoàn tất vào lúc {order.completedTime}</p>
                                ) : (
                                    <>
                                        <div className="mb-4 space-y-2 border-t border-b border-slate-50 dark:border-slate-800 py-3">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-slate-400 mt-0.5">person</span>
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{order.customer}</p>
                                                    <p className="text-sm text-slate-500">{order.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-slate-400 mt-0.5">location_on</span>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{order.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tổng cộng ({order.items} món)</p>
                                                <p className="text-lg font-bold text-primary">{order.total}</p>
                                            </div>
                                            <button 
                                                onClick={() => order.status === 'PENDING' ? console.log('Nhận đơn') : navigate(`/shipper/orders/${order.id}`)}
                                                className={`flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold transition-transform active:scale-95 ${order.status === 'PENDING' ? 'bg-primary text-slate-900 shadow-sm' : 'border-2 border-primary bg-transparent text-slate-900 dark:text-primary hover:bg-primary/10'}`}
                                            >
                                                {order.status === 'PENDING' ? 'Nhận đơn' : 'Chi tiết'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                {/* Bottom Navigation */}
                <footer className="sticky bottom-0 z-50 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 flex justify-between items-center z-50">
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
                        onClick={() => navigate('/shipper/dashboard')}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-[10px] font-bold uppercase">Tổng quan</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-primary"
                        onClick={() => navigate('/shipper/orders')}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold uppercase">Đơn hàng</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
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

export default OrderListShipperPage;

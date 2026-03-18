import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';

const MerchantOrderPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Pending');

    const orders = [
        { id: "#ORD-9421", time: "2 mins ago", customer: "Sarah Jenkins", type: "Pickup", items: "2x Truffle Burger, 1x Fries", total: "$42.50", status: "Pending" },
        { id: "#ORD-9420", time: "5 mins ago", customer: "Michael Chen", type: "Delivery", items: "1x Margherita Pizza (L)", total: "$18.90", status: "Pending" },
        { id: "#ORD-9418", time: "12 mins ago", customer: "Emma Watson", type: "Pickup", items: "3x Tacos Al Pastor", total: "$24.00", status: "Confirmed" },
        { id: "#ORD-9415", time: "18 mins ago", customer: "David Miller", type: "Dining In - Table 4", items: "1x Ribeye Steak, 1x Red Wine", total: "$68.00", status: "Confirmed" },
        { id: "#ORD-9412", time: "25 mins ago", customer: "Sophia Lee", type: "Pickup", items: "1x Salmon Poke Bowl", total: "$16.50", status: "Ready" }
    ];

    const tabs = [
        { name: "Pending", count: 5 },
        { name: "Confirmed", count: 3 },
        { name: "Ready for Pickup", count: 2 },
        { name: "Delivering", count: 4 },
        { name: "Completed", count: 20 },
        { name: "Cancelled", count: 2 }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Ready': return 'bg-primary/20 text-slate-900 dark:text-slate-100';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Order Management" />

                <div className="p-8 flex flex-col gap-6">
                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black leading-tight tracking-tight">Orders</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Track and manage your restaurant's order flow in real-time.</p>
                        </div>
                        <button className="bg-primary text-background-dark font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined">add</span>
                            New Manual Order
                        </button>
                    </div>

                    {/* Status Tabs */}
                    <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                        <div className="flex gap-8 min-w-max">
                            {tabs.map(tab => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name.split(' ')[0])}
                                    className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-all ${activeTab === tab.name.split(' ')[0] ? 'border-primary text-slate-900 dark:text-slate-100 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                                >
                                    <p className="text-sm font-bold">{tab.name} ({tab.count})</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative h-12 w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="block w-full h-full pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary text-sm outline-none" placeholder="Search by Order ID or Customer Name" type="text" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 whitespace-nowrap">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                <span className="text-sm font-medium">Today</span>
                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                            </button>
                            <button className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 whitespace-nowrap">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                <span className="text-sm font-medium">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/merchant/orders/${order.id.replace('#','')}`)}>{order.id}</td>
                                            <td className="px-6 py-4 text-sm">{order.time}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{order.customer}</span>
                                                    <span className="text-xs text-slate-500">{order.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm max-w-xs truncate">{order.items}</td>
                                            <td className="px-6 py-4 font-bold">{order.total}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyles(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {order.status === 'Pending' ? (
                                                        <>
                                                            <button className="bg-primary text-background-dark text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90">Accept</button>
                                                            <button className="border border-red-500 text-red-500 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Reject</button>
                                                        </>
                                                    ) : order.status === 'Confirmed' ? (
                                                        <button className="bg-primary/20 text-slate-900 dark:text-slate-100 border border-primary/50 text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/30">Ready for Pickup</button>
                                                    ) : (
                                                        <button onClick={() => navigate(`/merchant/orders/${order.id.replace('#','')}`)} className="p-2 text-slate-400 hover:text-primary">
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-500">Showing 1 to 5 of 36 orders</p>
                            <div className="flex gap-2">
                                <button className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50" disabled>
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <button className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-900">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantOrderPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';

const MerchantDashboardPage = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "New Orders", value: "12", icon: "shopping_cart", color: "blue", trend: "+5%", trendIcon: "trending_up" },
        { label: "Today's Revenue", value: "2,450,000đ", icon: "payments", color: "primary", trend: "-2%", trendIcon: "trending_down", isPrimary: true },
        { label: "Pending Orders", value: "5", icon: "pending_actions", color: "amber", trend: "+10%", trendIcon: "trending_up" },
        { label: "Preparing Orders", value: "3", icon: "outdoor_grill", color: "purple", trend: "0%", trendIcon: "" }
    ];

    const staffPerformance = [
        { name: "Minh Pham", role: "Preparation Master", rating: "4.8★", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAes1N0wwMnzOd1BJ56rOw1iIE44_nV6Hxugu0vJCwSkOR5NeKXHXruBQ6frHKrN1c8W5L3z_1rmbSy-46r6S9DBjZfo_VjMnUbxs4LhV02UiRU983bQQ1NyIhbX3Djg0EzAr3qCUATYBWOcrFbqXmAXHhHWUJ9-j6csR55hfdR6gCfw1REwgtYF8CD03Cjo63Ont_7N_4VHu3ZOYUvYMa4GH8-k_o_Yk7R-pYEraHwrHfBchr9v9trf-n9T1g0vK9GhM6SxohxA_-Z" },
        { name: "Lan Nguyen", role: "Order Fulfilment", rating: "4.5★", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtWStMkk2AeQ26dESrZy6uCdE0E0icXIyYcM_FE4HKAuLIeWmYc5vawh6ZnWIjzdgPp67xY7I6grxoJv_jJL-UjuAP-Zvp9Q4gDrpUaqf-htU8hUspiXEk3fpoM5_gU0ukDalmSTd9ZN0QVvuMZrDtwD096Ly3tbVfzMu7TUh7NOh4ytrHD3hzhEf2xJxIYfL9oCeaomBolLxP01MwAKQc_tXef8DmbSkNCCJwydk4HLqCLroP6YjRSjOW854KIqY8m3veGTtS_6jg" },
        { name: "Tuan Tran", role: "Express Delivery", rating: "4.9★", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA-oTiC0mLnYsPTGKY8RSfWgmUTKDqrlEMztNQD18zsIhUH2cL_7NaPazf8CjpUZ_4b47-Y4Ri565gz4-f-hCUM551Q4u3uiR_8Y9lLNvT40IkDybVa289JJ9NvxSG19O_PGQiV4LQralDEw8OgyRKl3elC_964nQ9e9yl2si1mW97IFpkQr20irdsmepoYzSIX36MyRNq2pnrlmEqpNSyuWof0w11qePEUN7FeCsdcwLqB12EzMGA6oY_4vURe2cV5ehyPhjO3H0e" }
    ];

    const recentOrders = [
        { id: "#ORD-9902", time: "12:45 PM", customer: "Nguyen Hoang An", total: "145,000đ", status: "Preparing", statusColor: "amber" },
        { id: "#ORD-9899", time: "12:38 PM", customer: "Lê Thị Thuỳ", total: "85,000đ", status: "Ready", statusColor: "primary" },
        { id: "#ORD-9895", time: "12:22 PM", customer: "Trần Minh Quân", total: "210,000đ", status: "Delivered", statusColor: "blue" },
        { id: "#ORD-9890", time: "12:15 PM", customer: "Phạm Đăng Khoa", total: "120,000đ", status: "Delivered", statusColor: "blue" },
        { id: "#ORD-9888", time: "12:05 PM", customer: "Bùi Anh Tuấn", total: "455,000đ", status: "Cancelled", statusColor: "red" }
    ];

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Merchant Dashboard" />

                <div className="p-8 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${stat.isPrimary ? 'bg-primary/20 text-primary' : stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-primary' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                                        {stat.trendIcon && <span className="material-symbols-outlined text-xs">{stat.trendIcon}</span>} {stat.trend}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-lg font-bold">Weekly Revenue Trend</h4>
                                <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium rounded-lg px-3 py-1 text-slate-600 dark:text-slate-400 focus:ring-primary">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <div className="relative h-[300px] w-full flex items-end justify-between gap-2">
                                {[60, 45, 80, 65, 55, 90, 40].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className={`w-full rounded-t-lg relative group transition-all ${h === 90 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'}`}>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h/40).toFixed(1)}M</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 px-1">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
                            </div>
                        </div>

                        {/* Staff Performance */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <h4 className="text-lg font-bold mb-6">Staff Performance</h4>
                            <div className="space-y-6">
                                {staffPerformance.map((staff, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{staff.name}</p>
                                                <p className="text-xs text-slate-400">{staff.role}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-primary">{staff.rating}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                View Detailed Report
                            </button>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h4 className="text-lg font-bold">Recent Orders</h4>
                            <button onClick={() => navigate('/merchant/orders')} className="text-primary text-sm font-bold hover:underline">View All Orders</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold">
                                        <th className="px-8 py-4">Order ID</th>
                                        <th className="px-8 py-4">Time</th>
                                        <th className="px-8 py-4">Customer</th>
                                        <th className="px-8 py-4">Total</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-8 py-4 text-sm font-bold">{order.id}</td>
                                            <td className="px-8 py-4 text-sm text-slate-500 dark:text-slate-400">{order.time}</td>
                                            <td className="px-8 py-4 text-sm font-medium">{order.customer}</td>
                                            <td className="px-8 py-4 text-sm font-bold">{order.total}</td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${order.statusColor === 'primary' ? 'primary/20 text-primary' : order.statusColor + '-100 text-' + order.statusColor + '-600 dark:bg-' + order.statusColor + '-900/30 dark:text-' + order.statusColor + '-200'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <button onClick={() => navigate(`/merchant/orders/${order.id}`)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantDashboardPage;

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';

const MerchantOrderDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const orderItems = [
        { name: "Signature Truffle Burger", options: "Extra Cheese, Medium Rare", note: "No onions", price: "$32.00", qty: "2", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSAiRNjkLcfWtDDylpGgOWxRvmQMlWhBG7new2voUBh3_tLtOKpX9Btg6Tui-03TDAx79v0aaD-R4yUJO8OkstdXOL-9cClbp0u7R8jLWtD7eyFVnHjGDFIot3XcfQSTxctjQVZ3Ss8C6GYNHuoEdkd_Ep1HON7VSG7ovOoqEPjxAuAEL1kTywlKsvzhvT4uY-tLwgB3wbI-9iVi14IwiQczbCpQqs4rJkvUKravVCnL6MxGoU4QI7uunBKfIRx8Em-zce-exO1yDm" },
        { name: "Hand-Cut Parmesan Fries", options: "Large Portion", price: "$8.50", qty: "1", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPbFYvVmpahtfHFtDWowx5Nr8TADAtw78pvIFy3lkQmnTv7hTD_Yi46ENxrMTby579VgY2q25KhGbf2PaPXD8e2EriKLuxHBlg5zuP2W_hMqEgKkqlRzgdMa0a6FgbzvgJ5aZddayJLoDL5E23lI5JmYpUytpX-dGSSMhpJR4Nb4y6r7G8oFhXs6rlCbPghgCL1MiFeDn8x_xUze460-VCsPaJmXdAdVn6v2yPL36NokPAy1a4pjp-B76ZxmqBZYEiG9qEDuw7wOKp" }
    ];

    const timeline = [
        { status: "Preparing", time: "Oct 24, 12:50 PM", actor: "Chef Marco" },
        { status: "Confirmed", time: "Oct 24, 12:47 PM", actor: "System Auto-Confirm" },
        { status: "Order Created", time: "Oct 24, 12:45 PM", actor: "Customer App" }
    ];

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title={`Order #${id || 'SPF-1234'}`} />

                <div className="p-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items & Timeline */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <h2 className="text-lg font-bold">Order Items</h2>
                                    <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">Preparing</span>
                                </div>
                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="p-6 flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                                <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.options}</p>
                                                {item.note && <p className="text-primary font-bold text-[10px] mt-1 bg-primary/10 inline-block px-2 py-0.5 rounded uppercase tracking-wider">{item.note}</p>}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900 dark:text-slate-100 text-base">x {item.qty}</p>
                                                <p className="text-sm text-slate-500 font-medium">{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-medium">$40.50</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Delivery Fee</span>
                                        <span className="font-medium">$2.00</span>
                                    </div>
                                    <div className="flex justify-between font-black text-xl pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                        <span className="text-slate-900 dark:text-white">Total</span>
                                        <span className="text-primary">$42.50</span>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-6">Order Timeline</h2>
                                <div className="space-y-6">
                                    {timeline.map((event, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="size-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                                                {idx !== timeline.length - 1 && <div className="w-px h-full bg-slate-200 dark:bg-slate-800 mt-2"></div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{event.status}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{event.time} • {event.actor}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Customer & Payment */}
                        <div className="space-y-8">
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4">Customer</h2>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">John Doe</p>
                                        <p className="text-sm text-slate-500 font-medium">+1 (555) 0123</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Delivery Address</p>
                                        <p className="text-sm leading-relaxed font-medium">
                                            742 Evergreen Terrace<br />
                                            Springfield, IL 62704
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
                                        <p className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">info</span> Customer Note
                                        </p>
                                        <p className="text-sm text-amber-900 dark:text-amber-200 italic font-medium">"No onions in the burger please, allergy concern."</p>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4">Payment</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500 font-medium">Method</span>
                                        <div className="flex items-center gap-1.5 text-sm font-bold">
                                            <span className="material-symbols-outlined text-base text-primary">account_balance_wallet</span>
                                            SmartPay Wallet
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500 font-medium">Status</span>
                                        <span className="flex items-center gap-1.5 text-sm font-black text-emerald-600 dark:text-emerald-400">
                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                            Paid
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <div className="space-y-3">
                                <button className="w-full py-4 px-6 bg-primary text-background-dark font-black text-sm uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined font-bold">check</span>
                                    Mark as Ready
                                </button>
                                <button className="w-full py-4 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    <span className="material-symbols-outlined font-bold">cancel</span>
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantOrderDetailPage;

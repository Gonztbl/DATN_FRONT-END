import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';

const MerchantSettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Store Settings" />

                <div className="p-8">
                    <div className="max-w-4xl mx-auto flex flex-col gap-8">
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">Store Status</h3>
                                    <p className="text-xs text-slate-500 font-medium">Enable or disable ordering instantly</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked type="checkbox" className="sr-only peer" />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-bold">Accepting Orders</span>
                                </label>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span> Basic Info
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Restaurant Name</p>
                                    <input className="rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary w-full py-2 px-3 text-sm font-medium outline-none" placeholder="The Golden Grill" type="text" defaultValue="Cơm Tấm Phúc Lộc Thọ" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</p>
                                    <input className="rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary w-full py-2 px-3 text-sm font-medium outline-none" placeholder="+84 ..." type="tel" defaultValue="0988223344" />
                                </div>
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</p>
                                    <input className="rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary w-full py-2 px-3 text-sm font-medium outline-none" placeholder="123 Main St, ..." type="text" defaultValue="789 Culinary Avenue, Foodie District" />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">schedule</span> Operating Hours
                            </h3>
                            <div className="space-y-4">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                    <div key={day} className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300">{day}</div>
                                        <div className="col-span-4">
                                            <input className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary py-1.5 px-3 text-xs md:text-sm outline-none" type="time" defaultValue="09:00" />
                                        </div>
                                        <div className="col-span-1 text-center text-slate-400 text-xs font-medium uppercase">to</div>
                                        <div className="col-span-4">
                                            <input className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary py-1.5 px-3 text-xs md:text-sm outline-none" type="time" defaultValue="22:00" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="flex justify-end gap-3 mt-4">
                            <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Reset Changes
                            </button>
                            <button className="px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity active:scale-95">
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantSettingsPage;

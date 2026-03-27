import Sidebar from "../../../components/layout/Sidebar";
import { useTheme } from "../../../context/ThemeContext";

export default function SpendingSummaryPage() {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div className="flex min-h-screen bg-[#f6f8f7] dark:bg-slate-900">
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* PAGE HEADER */}
                <div className="px-8 py-8 flex justify-between items-center border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
                    <div>
                        <h2 className="text-4xl font-black text-[#111714] dark:text-white">
                            Spending Summary
                        </h2>
                        <p className="text-[#648772] dark:text-slate-400">
                            Track your financial health and habits
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            <span className="material-symbols-outlined transition-all">
                                {isDarkMode ? "light_mode" : "dark_mode"}
                            </span>
                        </button>
                        <button className="flex items-center gap-2 bg-primary px-5 py-2.5 rounded-lg font-bold text-[#111714]">
                            <span className="material-symbols-outlined">download</span>
                            Download Statement
                        </button>
                    </div>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto px-8 pb-12 pt-6">
                    <div className="max-w-6xl mx-auto flex flex-col gap-6">
                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Total Balance" value="$12,450.00" icon="account_balance" />
                            <StatCard title="Monthly Spending" value="$3,240.50" icon="credit_card" />
                            <StatCard title="Monthly Savings" value="$1,100.00" icon="savings" />
                        </div>

                        {/* BAR CHART */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 text-[#111714] dark:text-white">
                                Spending Activity
                            </h3>
                            <div className="grid grid-cols-7 gap-4 h-64 items-end">
                                {[
                                    { day: "Mon", h: "45%" },
                                    { day: "Tue", h: "65%" },
                                    { day: "Wed", h: "30%" },
                                    { day: "Thu", h: "85%", active: true },
                                    { day: "Fri", h: "55%" },
                                    { day: "Sat", h: "90%" },
                                    { day: "Sun", h: "40%" },
                                ].map((d) => (
                                    <div key={d.day} className="flex flex-col items-center gap-2">
                                        <div
                                            className={`w-8 rounded-t-lg ${d.active
                                                ? "bg-primary shadow-[0_0_15px_-3px_rgba(54,226,123,0.5)]"
                                                : "bg-primary/20"
                                            }`}
                                            style={{ height: d.h }}
                                        />
                                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                                            {d.day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TRANSACTIONS */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between">
                                <h3 className="font-bold text-[#111714] dark:text-white">Recent Transactions</h3>
                                <button className="text-primary font-bold">View All</button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#f6f8f7] dark:bg-slate-800">
                                    <tr>
                                        <Th>Merchant</Th>
                                        <Th>Category</Th>
                                        <Th>Date</Th>
                                        <Th right>Amount</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <Transaction name="Starbucks Coffee" category="Food & Drink" date="Oct 24, 2023" amount="- $12.50" />
                                    <Transaction name="Nike Store" category="Shopping" date="Oct 23, 2023" amount="- $145.00" />
                                    <Transaction name="Upwork Inc." category="Freelance Income" date="Oct 22, 2023" amount="+ $850.00" positive />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="rounded-xl p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{title}</p>
                <span className="material-symbols-outlined text-primary">{icon}</span>
            </div>
            <p className="text-3xl font-bold text-[#111714] dark:text-white">{value}</p>
        </div>
    );
}

function Th({ children, right }) {
    return (
        <th className={`py-4 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 ${right ? "text-right" : ""}`}>
            {children}
        </th>
    );
}

function Transaction({ name, category, date, amount, positive }) {
    return (
        <tr className="hover:bg-[#f6f8f7] dark:hover:bg-slate-700 border-b border-gray-50 dark:border-slate-800 last:border-0">
            <td className="py-4 px-6 font-bold text-[#111714] dark:text-white">{name}</td>
            <td className="py-4 px-6 text-gray-600 dark:text-slate-400">{category}</td>
            <td className="py-4 px-6 text-gray-500 dark:text-slate-400">{date}</td>
            <td className={`py-4 px-6 text-right font-bold ${positive ? "text-primary" : "text-[#111714] dark:text-white"}`}>
                {amount}
            </td>
        </tr>
    );
}

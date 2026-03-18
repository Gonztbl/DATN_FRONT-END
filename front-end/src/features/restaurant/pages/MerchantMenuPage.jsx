import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';

const MerchantMenuPage = () => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 1, name: "Artisan Pepperoni", price: "$18.50", desc: "Sourdough base, San Marzano tomatoes, mozzarella.", category: "Main Course", sold: "1,240 sold", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAln-1Vs2lpkeaVyzz6A0omLG_jLksXNEJqnJuEOMBnUjB8xqZrDUCFONusZEtFq-7gcI0BPdg_-RbSVqZgGc2HZTcc1d1-Z1vKmAx_uOz0B9fUX9s5LbMYqF95dl0fUPp0TanKa2mdAJ7p0Bwdu2I-oUMwshJN8lzJ_voeEmUQ5xOiQfZXPkAHTEcNtEnqiIP2MO3w-kPNKUcOcDiVCsE2nnPybJsuLR1TD7pfV7uPkv04PSE1R0pJ0u9kYGHy3AVzyR62meYlJd-2", status: "In Stock" },
        { id: 2, name: "Garden Power Bowl", price: "$14.00", desc: "Quinoa, charred broccoli, avocado, tahini dressing.", category: "Appetizers", sold: "850 sold", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtQmyJRar2q-ofuRLOItfKVw12hr7dzrO1SFN4Exb3tqhTeHhBxxszUnGkfOUHxOy0mNSodgENhNq6aETqIPCn8cMg0oVt3vbLrniACVKTnzi75LWBeN5pbu47FG5tXQT6O30IGoNmzM5D4obnzQIqC2lb-fb1zpvbfBk860ch3pH0IhtI0bgozdHwhEVJDhcYhx2puV0vQkm07b7DbVSAl7TtAkndWJdzESdwDw8qHGac5Ef9u_FGC3_bIOH7jAZ0JrDReA4CRcC8", status: "In Stock" },
        { id: 3, name: "Glazed Delight", price: "$6.50", desc: "Hand-rolled yeast donut with dark chocolate ganache.", category: "Desserts", sold: "2,100 sold", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkHnJMWOn4dUqJxhoqhwPtRYLpfGFIYvzoujf8VUL1Iv38iX01vnqeP8BdlBOQoRlrSombhsbQ-jKuUEdhoipHzqBG-j-cqGnrjFmfFtxwYjGo-CYHcKegs-Szvzkuv-KqhxM1tZ0_CzJhvf3Wkv0JVe1T2qU6PPiVeFHGwrlQS1vyuoGb1Zeliz9t_zjUTZKwRcRMVQgSriTg0-yhX5SJCTJeNPQdkXgqxLU5zOXQOZus7DAT-OwWWt4y-0smoOPP3Nr3vDHT-GEl", status: "Out of Stock" },
        { id: 4, name: "Signature Cold Brew", price: "$5.75", desc: "18-hour steep, single origin beans, touch of vanilla.", category: "Beverages", sold: "3,400 sold", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0OzIl8B0MTrowTxmsyFjDSKb329_O-Y38jbrdD68a8XabETZVPxZ5Gj9pdaU_8ak_CvAP_DEsRVYxrhnb5aT_5PRMb_sejFwSTuRs7dFfG-jkpGe6fHxAiN0728kVywylDkcp3Sb8KaY4UpJm-iHVuDqSQG6IUyR0K5L9i7J5MwXG0ixmD1xpanb3V6qxxEBWjhXcv0geSmXr9KYKI1GN_GEZ237_BWLbW5SI6aG1R-2BA_T8HwuEmKKSZXY4cJw0XTCeBVv-g7wL", status: "In Stock" }
    ];

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Menu Management" />

                <div className="p-8">
                    {/* Page Actions */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                            {['All Items', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages'].map((cat, idx) => (
                                <button key={cat} className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${idx === 0 ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 bg-primary text-background-dark px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary/10">
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Add New Item</span>
                        </button>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menuItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group hover:shadow-xl transition-all duration-300">
                                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                    <img src={item.img} alt={item.name} className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.status === 'Out of Stock' ? 'grayscale' : ''}`} />
                                    {item.status === 'Out of Stock' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 shadow-sm">{item.category}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg tracking-tight">{item.name}</h3>
                                        <span className="text-primary font-black">{item.price}</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2 h-8 font-medium">{item.desc}</p>
                                    <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-slate-400 text-lg">trending_up</span>
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{item.sold}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</span>
                                            <button className={`w-10 h-5 rounded-full relative transition-all ${item.status === 'In Stock' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                                <span className={`absolute top-1 size-3 bg-white rounded-full transition-all ${item.status === 'In Stock' ? 'right-1' : 'left-1'}`}></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase tracking-wider">
                                            <span className="material-symbols-outlined text-sm">edit</span> Edit
                                        </button>
                                        <button className="p-2 bg-slate-100 dark:bg-slate-800 text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                                            <span className="material-symbols-outlined text-base">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Add Placeholder */}
                        <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-800 transition-all group group hover:border-primary">
                            <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all duration-300 group-hover:scale-110">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-slate-700 dark:text-slate-200">Create New Item</p>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Add to your menu</p>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantMenuPage;

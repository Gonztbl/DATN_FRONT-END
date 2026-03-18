import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';

const OrderDetailShipperPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showFailModal, setShowFailModal] = useState(false);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <HeaderShipper title={`Đơn hàng #${id || 'SP12345'}`} showBack={true} />

                <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-4 p-4">
                    {/* Customer Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="mb-3 flex items-center justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 font-bold text-primary">
                                <span className="material-symbols-outlined">person</span> Khách hàng
                            </h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-full bg-cover bg-center border border-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcv0qe1lLgzBIxyz1ZQ14ghc7AAr7lKtEGppfnEY35xYNDliVPvfzmdqFIRoCx95FxNcaEPtQH44tv3IoD953uVPP3Fav_Ipben3xnlLOnpH7WCmfkO0Q8WMsLOTz9u-aYl-DP0ir-o2b_1H6rbfJGt1POG3pb05N1b7MWIO5YCBROsYZReP8Qe_qs8vTy-u03BtVujAbWOPDYrZMAhLXEpfgktxbAuwKGM54tvH9Qiq6ZLaLkA4fyf2Brv0osFCnyJLF0HbfQDGdK")' }}></div>
                                <div>
                                    <p className="font-bold">Nguyễn Văn A</p>
                                    <p className="text-sm text-slate-500">090 123 4567</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-slate-900 shadow-sm shadow-primary/30 transition-transform active:scale-95">
                                <span className="material-symbols-outlined text-sm">call</span>
                                Gọi điện
                            </button>
                        </div>
                        <div className="mt-4 flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Địa chỉ giao hàng</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">123 Đường Lê Lợi, Quận 1, TP.HCM</p>
                                <p className="mt-1 text-sm italic text-orange-600 dark:text-orange-400">Ghi chú: Giao ở cổng sau</p>
                            </div>
                            <button className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-white text-primary dark:bg-slate-800">
                                <span className="material-symbols-outlined">map</span>
                            </button>
                        </div>
                    </section>

                    {/* Restaurant Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="mb-3 flex items-center justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 font-bold text-primary">
                                <span className="material-symbols-outlined">store</span> Nhà hàng
                            </h3>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <p className="font-bold">Cơm Tấm Phúc Lộc Thọ</p>
                                <p className="text-sm text-slate-500">236 Hai Bà Trưng, Phường Tân Định, Quận 1</p>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-sm font-bold text-primary">
                                <span className="material-symbols-outlined text-sm">directions</span>
                                Chỉ đường
                            </button>
                        </div>
                    </section>

                    {/* Order List Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="mb-3 border-b border-slate-50 pb-2 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 font-bold text-primary">
                                <span className="material-symbols-outlined">restaurant_menu</span> Chi tiết món ăn
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="size-14 overflow-hidden rounded-lg">
                                    <img alt="Món Cơm Tấm Sườn Bì Chả" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Cc0mJ__JfKMPMcbz5nWRz94c_W0L9wnyofLnCR27xAmu7pNSTmFlNJ9_vyhEWTSPeuUDlbpA_5nelPGiG_AoYPtR4dIMDSkWMf9dY_OlAmRNL2n57AkjPIXF1hPY4H9SVTc2FgyDFXL75ahUEHy_g1rhYU-b-z-jPh5JVk7dDqSLlI9r7HLT4AX9t9F3cpb6nsU1Y-lWCLB-iFqtiKlSaw8AIpKmmqTRMNp6R-9I5pm7VNt5s0QyxP591RrwyTfI4mDDZaSLxxXG" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">Cơm Tấm Sườn Bì Chả</p>
                                    <p className="text-sm text-slate-500">Số lượng: 02</p>
                                </div>
                                <p className="font-bold text-slate-700 dark:text-slate-300">130.000đ</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-14 overflow-hidden rounded-lg">
                                    <img alt="Trà đá" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwy1nxH9NC-3HdAtWJ-T-210Xt2qwvqlZtzTdztOGyjfamQurgxXcSQmbaxzEiKmNJA7LKwMRK6T0uOTjfpBWx7e-nj1dTkYxpDEoSua1UqSUBLg6AEiV-fw3UuulZPAcmPtxMGyyO5AVTIKxcM8y3822OVROQItS0QYHrx9mQO1J3c785CfITRVoeuhIQA7SG7Vrp8J6UkcqqvV9huxSIOHK9UpM55GGCLX_E2PphKoxBQuHmZTPY1AmBC4be6xCSdF342sGgYTmj" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">Trà Đá Mát Lạnh</p>
                                    <p className="text-sm text-slate-500">Số lượng: 02</p>
                                </div>
                                <p className="font-bold text-slate-700 dark:text-slate-300">10.000đ</p>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-dashed border-slate-200 pt-4 dark:border-slate-700">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Tạm tính</span>
                                <span>140.000đ</span>
                            </div>
                            <div className="mt-1 flex justify-between text-sm text-slate-500">
                                <span>Phí giao hàng</span>
                                <span>15.000đ</span>
                            </div>
                            <div className="mt-2 flex justify-between text-lg font-bold text-primary">
                                <span>TỔNG CỘNG</span>
                                <span>155.000đ</span>
                            </div>
                        </div>
                    </section>

                    {/* Timeline Section */}
                    <section className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="mb-4 font-bold">Lịch trình đơn hàng</h3>
                        <div className="relative space-y-6 pl-6">
                            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 size-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold">Đã xác nhận</p>
                                    <p className="text-xs text-slate-400">10:30</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 size-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-primary">Đã lấy hàng</p>
                                    <p className="text-xs text-slate-400">10:45</p>
                                </div>
                            </div>
                            <div className="relative opacity-40">
                                <div className="absolute -left-[23px] top-1 size-3 rounded-full bg-slate-300"></div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold">Đang giao hàng</p>
                                    <p className="text-xs text-slate-400">--:--</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="h-24"></div>
                </main>

                {/* Bottom Action Area */}
                <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:relative md:bg-transparent md:dark:bg-transparent">
                    <div className="mx-auto flex max-w-[640px] gap-2">
                        <button 
                            onClick={() => setShowFailModal(true)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-100 bg-slate-50 py-3 font-bold text-red-500 dark:border-slate-800 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <span className="material-symbols-outlined">cancel</span>
                            Thất bại
                        </button>
                        <button className="flex-[2] rounded-xl bg-primary py-3 font-bold text-slate-900 shadow-lg shadow-primary/30 transition-transform active:scale-95">
                            Xác nhận Giao hàng
                        </button>
                    </div>
                </footer>

                {/* Failure Modal */}
                {showFailModal && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 md:items-center md:p-4">
                        <div className="w-full max-w-[480px] rounded-t-3xl bg-white p-6 dark:bg-slate-900 md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Lý do giao thất bại?</h2>
                                <button onClick={() => setShowFailModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 transition-colors">close</button>
                            </div>
                            <div className="space-y-3">
                                {['Khách vắng nhà', 'Sai địa chỉ', 'Từ chối nhận', 'Khác'].map((reason) => (
                                    <label key={reason} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 transition-all hover:border-primary dark:border-slate-800">
                                        <span className="font-medium">{reason}</span>
                                        <input className="h-5 w-5 border-slate-300 text-primary focus:ring-primary" name="reason" type="radio" />
                                    </label>
                                ))}
                            </div>
                            <div className="mt-4">
                                <textarea className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 outline-none" placeholder="Nhập ghi chú chi tiết..." rows="3"></textarea>
                            </div>
                            <div className="mt-4">
                                <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Ảnh minh họa (không bắt buộc)</p>
                                <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-6 text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700 transition-colors">
                                    <span className="material-symbols-outlined">add_a_photo</span>
                                    Tải ảnh lên
                                </button>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button onClick={() => setShowFailModal(false)} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Hủy</button>
                                <button className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailShipperPage;

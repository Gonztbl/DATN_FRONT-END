import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loanService from "../api/loanService";
import { showSuccess, showError } from "../../../utils/swalUtils";
import Sidebar from "../../../components/layout/Sidebar";

// Hero image path
const HERO_IMAGE = "file:///C:/Users/ASUS/.gemini/antigravity/brain/d96f5b94-9091-44f2-ae47-18f3d8cb7830/loan_hero_premium_1775211860533.png";

export default function LoanUserApply() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: 10000000,
        term: 12,
        purpose: "",
        declaredIncome: "",
        jobSegmentNum: "SALARIED"
    });

    const [errors, setErrors] = useState({});

    const jobSegments = [
        { value: "BUSINESS_OWNER", label: "Chủ doanh nghiệp" },
        { value: "SALARIED", label: "Nhân viên lương" },
        { value: "SELF_EMPLOYED", label: "Tự kinh doanh" },
        { value: "FREELANCER", label: "Freelancer" },
        { value: "RETIRED", label: "Người hưu trí" },
        { value: "STUDENT", label: "Sinh viên" },
        { value: "UNEMPLOYED", label: "Chưa có việc làm" }
    ];

    const validate = () => {
        const newErrors = {};
        if (!formData.amount || formData.amount < 1000000 || formData.amount > 1000000000) {
            newErrors.amount = "Vui lòng chọn số tiền từ 1M đến 1B VND";
        }
        if (!formData.term || formData.term < 3 || formData.term > 60) {
            newErrors.term = "Kỳ hạn 3-60 tháng";
        }
        if (!formData.purpose || formData.purpose.trim().length < 5 || formData.purpose.trim().length > 255) {
            newErrors.purpose = "Mô tả mục đích vay (5-255 ký tự)";
        }
        if (formData.declaredIncome === "" || formData.declaredIncome < 0) {
            newErrors.declaredIncome = "Cần khai báo thu nhập";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === "amount" || id === "term" || id === "declaredIncome" ? Number(value.replace(/[^0-9]/g, "")) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await loanService.applyLoan(formData);
            if (response.aiDecision === "PASSED_AI" || response.finalStatus === "PENDING_ADMIN") {
                await showSuccess("Nộp đơn thành công!", "AI đã duyệt hồ sơ sơ bộ. Đang chờ Admin giải ngân.");
                navigate("/loans/history");
            } else {
                await showError("Hồ sơ bị từ chối", response.descriptionText || "Đơn vay chưa đạt chuẩn AI.");
                navigate("/loans/history");
            }
        } catch (error) {
            console.error("Submission error:", error);
            showError("Lỗi hệ thống", error.response?.data?.message || "Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    return (
        <div className="flex h-screen bg-white font-body selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
            <Sidebar activeRoute="loans" />
            
            <main className="flex-1 flex flex-col md:flex-row h-full">
                {/* Left Section (Visual + Branding) */}
                <section className="hidden md:flex md:w-[40%] h-full relative overflow-hidden bg-emerald-900">
                    <img 
                        src={HERO_IMAGE} 
                        alt="Premium Loan" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-110 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-transparent"></div>
                    
                    <div className="relative z-10 p-12 flex flex-col justify-between h-full">
                        <div>
                            <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
                                SmartPay Premium Credit
                            </span>
                            <h1 className="text-5xl font-extrabold text-white font-headline leading-tight tracking-tight mb-6">
                                Nâng tầm <br/> tài chính cá nhân
                            </h1>
                            <p className="text-emerald-50/80 text-sm font-medium leading-relaxed max-w-sm">
                                Trải nghiệm quy trình vay vốn hiện đại nhất với sự hỗ trợ của trí tuệ nhân tạo, đảm bảo tốc độ và tính bảo mật tuyệt đối.
                            </p>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                    <span className="material-symbols-outlined text-white text-xl">bolt</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Phê duyệt AI Siêu tốc</h3>
                                    <p className="text-emerald-100/60 text-xs mt-1">Kết quả đánh giá rủi ro chỉ trong vài giây.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                    <span className="material-symbols-outlined text-white text-xl">encrypted</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Bảo mật đa lớp</h3>
                                    <p className="text-emerald-100/60 text-xs mt-1">Dữ liệu được mã hóa chuẩn ngân hàng (AES-256).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Section (Form) */}
                <section className="flex-1 flex flex-col items-center justify-center bg-white p-8 md:p-16 h-full overflow-y-auto">
                    <div className="w-full max-w-lg">
                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold text-slate-900 font-headline tracking-tight mb-2">Đăng ký hồ sơ vay</h2>
                            <p className="text-slate-500 text-sm">Vui lòng điền các thông tin dưới đây để AI bắt đầu thẩm định.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Loan Amount */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tiền khoản vay</label>
                                    <span className="text-2xl font-black text-emerald-600 font-headline">{formatCurrency(formData.amount)} <span className="text-xs font-bold text-emerald-400">VND</span></span>
                                </div>
                                <div className="relative pt-2">
                                    <input 
                                        type="range" 
                                        min="1000000" 
                                        max="100000000" 
                                        step="1000000"
                                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                                        id="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.amount}</p>}
                            </div>

                            {/* Two Column Layout for Selects */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="term">Kỳ hạn vay</label>
                                    <select 
                                        id="term" 
                                        value={formData.term} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                                    >
                                        {[3, 6, 12, 24, 36, 48, 60].map(m => (
                                            <option key={m} value={m}>{m} tháng</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="jobSegmentNum">Nghề nghiệp</label>
                                    <select 
                                        id="jobSegmentNum" 
                                        value={formData.jobSegmentNum} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                                    >
                                        {jobSegments.map(job => (
                                            <option key={job.value} value={job.value}>{job.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Income Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="declaredIncome">Thu nhập hàng tháng</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        id="declaredIncome"
                                        placeholder="Nhập thu nhập (VD: 15,000,000)"
                                        value={formData.declaredIncome ? formatCurrency(formData.declaredIncome) : ""}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            setFormData({ ...formData, declaredIncome: Number(val) });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 group-focus-within:text-emerald-500">VND</span>
                                </div>
                                {errors.declaredIncome && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.declaredIncome}</p>}
                            </div>

                            {/* Purpose Textarea */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="purpose">Mục đích vay vốn</label>
                                <textarea 
                                    id="purpose" 
                                    rows="2"
                                    placeholder="Chia sẻ lý do bạn cần khoản vay này..."
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                ></textarea>
                                {errors.purpose && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.purpose}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-4 rounded-2xl font-headline text-lg font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Nộp hồ sơ ngay</span>
                                            <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
                                    SmartPay cam kết bảo mật thông tin. Bằng cách nộp hồ sơ, bạn đồng ý với <span className="font-bold text-emerald-600 underline cursor-pointer">Điều khoản sử dụng</span> của chúng tôi.
                                </p>
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slow-zoom {
                    0% { transform: scale(1.1); }
                    100% { transform: scale(1.2); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s linear infinite alternate;
                }
            `}} />
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import { useNotification } from '../../../context/NotificationContext';
import RegisterService from '../../auth/api/register/registerService';

export default function AdminUserCreatePage() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phone: '',
        passwordHash: '',
        confirmPassword: '',
        fullName: '',
        role: 'USER' // Mặc định là USER
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi của field khi người dùng nhập lại
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.userName.trim()) {
            newErrors.userName = "Tên đăng nhập không được để trống";
        } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(formData.userName)) {
            newErrors.userName = "Tên đăng nhập phải từ 4-20 ký tự, chỉ gồm chữ cái, số và dấu gạch dưới";
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ tên không được để trống";
        }

        if (!formData.email) {
            newErrors.email = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData.phone) {
            newErrors.phone = "Số điện thoại không được để trống";
        } else if (!/^0\d{9,10}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (VD: 09xxxxxxxx)";
        }

        if (!formData.passwordHash) {
            newErrors.passwordHash = "Mật khẩu không được để trống";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.passwordHash)) {
            newErrors.passwordHash = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ và số";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (formData.confirmPassword !== formData.passwordHash) {
            newErrors.confirmPassword = "Mật khẩu không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            // Chuẩn bị dữ liệu gửi đi
            // Ở đây ta bổ sung roles là một mảng chứa role được chọn
            const payload = {
                userName: formData.userName,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                passwordHash: formData.passwordHash,
                role: formData.role // Backend nhận trường "role" (string)
            };

            let response;
            if (formData.role === 'USER') {
                response = await RegisterService.adminCreateUser(payload);
            } else {
                response = await RegisterService.adminRegister(payload);
            }
            const { accountNumber } = response?.data || {};
            
            showSuccess(`Tạo tài khoản người dùng thành công!\n\nSố tài khoản: ${accountNumber || formData.phone || 'Không rõ'}`, "Thành công");
            navigate("/user-manager");
        } catch (err) {
            console.error("Error creating user:", err);
            
            if (err.response?.status === 409) {
                const responseData = err.response.data;
                const message = responseData.message || "Conflict occurred";
                const details = responseData.details;

                // Handle specific conflict cases using details
                if (details === "EMAIL_EXISTS") {
                    setErrors(prev => ({ ...prev, email: message }));
                    showError(message, "Conflict");
                } else if (details === "USERNAME_EXISTS") {
                    setErrors(prev => ({ ...prev, userName: message }));
                    showError(message, "Conflict");
                } else if (details === "PHONE_EXISTS") {
                    setErrors(prev => ({ ...prev, phone: message }));
                    showError(message, "Conflict");
                } else {
                    // Fallback for string messages or other details
                    const rawMessage = typeof responseData === 'string' ? responseData : message;
                    if (rawMessage.includes("Email")) {
                        setErrors(prev => ({ ...prev, email: rawMessage }));
                        showError(rawMessage, "Conflict");
                    } else if (rawMessage.includes("Username")) {
                        setErrors(prev => ({ ...prev, userName: rawMessage }));
                        showError(rawMessage, "Conflict");
                    } else if (rawMessage.includes("Phone")) {
                        setErrors(prev => ({ ...prev, phone: rawMessage }));
                        showError(rawMessage, "Conflict");
                    } else {
                        showError(rawMessage, "Conflict");
                    }
                }
            } else {
                showError(err.response?.data?.message || "Tạo người dùng thất bại. Vui lòng thử lại sau.", "Lỗi");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <SidebarAdmin />
            
            <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50 dark:bg-slate-950 min-w-0">
                <HeaderAdmin title="Quản lý người dùng" />

                <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full">
                    {/* Breadcrumbs-like Header */}
                    <div className="mb-8 font-display">
                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-500 dark:text-slate-400">
                             <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/user-manager')}>Quản lý người dùng</span>
                             <span className="material-symbols-outlined text-sm">chevron_right</span>
                             <span className="font-medium text-slate-900 dark:text-slate-200">Tạo tài khoản mới</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tạo tài khoản người dùng</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Thêm quản trị viên, nhân viên hoặc đối tác mới vào hệ thống SmartPay.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden font-display">
                        {/* Form Section: Personal Details */}
                        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Thông tin cá nhân</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên đăng nhập</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">person</span>
                                        <input 
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.userName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="VD: nguyenvan_a" 
                                            type="text"
                                        />
                                    </div>
                                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">badge</span>
                                        <input 
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="VD: Nguyễn Văn A" 
                                            type="text"
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Địa chỉ Email</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">mail</span>
                                        <input 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="email@smartpay.com" 
                                            type="email"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số điện thoại</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">call</span>
                                        <input 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="09xxxxxxxx" 
                                            type="tel"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Form Section: Security */}
                        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Bảo mật</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">lock</span>
                                        <input 
                                            name="passwordHash"
                                            value={formData.passwordHash}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.passwordHash ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="Nhập mật khẩu" 
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none flex items-center"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.passwordHash && <p className="text-red-500 text-xs mt-1">{errors.passwordHash}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">lock_reset</span>
                                        <input 
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="Xác nhận mật khẩu" 
                                            type={showConfirmPassword ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none flex items-center"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showConfirmPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Form Section: Access Role */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Vai trò & Quyền truy cập</h3>
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chọn vai trò hệ thống</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {[
                                        { id: 'USER', label: 'NGƯỜI DÙNG', icon: 'person' },
                                        { id: 'SHIPPER', label: 'TÀI XẾ', icon: 'local_shipping' },
                                        { id: 'SUPPORT', label: 'HỖ TRỢ', icon: 'headset_mic' },
                                        { id: 'RESTAURANT_OWNER', label: 'CHỦ QUÁN', icon: 'restaurant' }
                                    ].map((role) => (
                                        <label key={role.id} className="cursor-pointer group">
                                            <input 
                                                type="radio" 
                                                name="role" 
                                                value={role.id} 
                                                checked={formData.role === role.id}
                                                onChange={handleChange}
                                                className="peer hidden" 
                                            />
                                            <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 hover:border-primary/50 transition-all text-center h-full">
                                                <span className={`material-symbols-outlined mb-2 ${formData.role === role.id ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>{role.icon}</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{role.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button 
                                onClick={() => navigate('/user-manager')}
                                className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors" 
                                type="button"
                            >
                                Hủy
                            </button>
                            <button 
                                disabled={loading}
                                className={`px-8 py-2.5 bg-primary text-black text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                type="submit"
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Tạo tài khoản
                            </button>
                        </div>
                    </form>

                    {/* Help Alert */}
                    <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Lưu ý quan trọng</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Tài khoản mới tạo sẽ nhận được email xác thực tại địa chỉ đã cung cấp. Tài khoản Quản trị viên cần thiết lập bảo mật 2 lớp (2FA) trong lần đăng nhập đầu tiên.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

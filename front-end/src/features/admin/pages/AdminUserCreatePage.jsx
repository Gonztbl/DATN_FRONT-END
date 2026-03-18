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
            newErrors.userName = "Username is required";
        } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(formData.userName)) {
            newErrors.userName = "Username must be 4–20 chars, letters, numbers, underscore only";
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^0\d{9,10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number is invalid (e.g. 09xxxxxxxx)";
        }

        if (!formData.passwordHash) {
            newErrors.passwordHash = "Password is required";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.passwordHash)) {
            newErrors.passwordHash = "Password must be at least 8 chars and contain letters & numbers";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (formData.confirmPassword !== formData.passwordHash) {
            newErrors.confirmPassword = "Passwords do not match";
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

            const response = await RegisterService.adminRegister(payload);
            const { accountNumber } = response.data;
            
            showSuccess(`User account created successfully!\n\nAccount Number: ${accountNumber || formData.phone}`, "Success");
            navigate("/user-manager");
        } catch (err) {
            console.error("Error creating user:", err);
            if (err.response?.status === 409) {
                const message = err.response.data;
                if (typeof message === 'string') {
                    if (message.includes("Email")) setErrors(prev => ({ ...prev, email: message }));
                    if (message.includes("Username")) setErrors(prev => ({ ...prev, userName: message }));
                    if (message.includes("Phone")) setErrors(prev => ({ ...prev, phone: message }));
                } else {
                    showError(err.response?.data?.message || "User already exists", "Conflict");
                }
            } else {
                showError(err.response?.data?.message || "Failed to create user. Please try again later.", "Error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <SidebarAdmin />
            
            <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50 dark:bg-background-dark/50 min-w-0">
                <HeaderAdmin title="User Management" />

                <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full">
                    {/* Breadcrumbs-like Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                             <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/user-manager')}>User Management</span>
                             <span className="material-symbols-outlined text-sm">chevron_right</span>
                             <span className="font-medium text-slate-900 dark:text-white">Create New Account</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Create User Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Add a new administrator, staff member, or partner to the SmartPay ecosystem.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        {/* Form Section: Personal Details */}
                        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Username</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                        <input 
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${errors.userName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="e.g. jsmith_admin" 
                                            type="text"
                                        />
                                    </div>
                                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Full Name</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">badge</span>
                                        <input 
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="e.g. John Smith" 
                                            type="text"
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Email Address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                        <input 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="email@smartpay.com" 
                                            type="email"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Phone Number</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">call</span>
                                        <input 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="09xxxxxxxx" 
                                            type="tel"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Form Section: Security */}
                        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Security</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                        <input 
                                            name="passwordHash"
                                            value={formData.passwordHash}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${errors.passwordHash ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="••••••••" 
                                            type="password"
                                        />
                                    </div>
                                    {errors.passwordHash && <p className="text-red-500 text-xs mt-1">{errors.passwordHash}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Confirm Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock_reset</span>
                                        <input 
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`} 
                                            placeholder="••••••••" 
                                            type="password"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Form Section: Access Role */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Account Role & Access</h3>
                            <div className="space-y-4">
                                <label className="text-sm font-semibold">Assign System Role</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {[
                                        { id: 'ADMIN', label: 'ADMIN', icon: 'shield_person' },
                                        { id: 'USER', label: 'USER', icon: 'person' },
                                        { id: 'SHIPPER', label: 'SHIPPER', icon: 'local_shipping' },
                                        { id: 'SUPPORT', label: 'SUPPORT', icon: 'headset_mic' },
                                        { id: 'RESTAURANT_OWNER', label: 'OWNER', icon: 'restaurant' }
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
                                            <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 transition-all text-center h-full">
                                                <span className={`material-symbols-outlined mb-2 ${formData.role === role.id ? 'text-primary' : 'text-slate-400'}`}>{role.icon}</span>
                                                <span className="text-xs font-bold">{role.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button 
                                onClick={() => navigate('/user-manager')}
                                className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors" 
                                type="button"
                            >
                                Cancel
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
                                Create Account
                            </button>
                        </div>
                    </form>

                    {/* Help Alert */}
                    <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <div>
                            <p className="text-sm font-bold">Important Note</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Newly created accounts will receive a verification email at the address provided. Admin accounts require additional 2FA setup on first login.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

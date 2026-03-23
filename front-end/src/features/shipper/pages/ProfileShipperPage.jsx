import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderShipper from '../../../components/layout/HeaderShipper';
import shipperService from '../api/shipperApi';
import Swal from 'sweetalert2';

const ProfileShipperPage = () => {
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(false);
    
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        avatar: '',
        id: ''
    });

    const [vehicle, setVehicle] = useState({
        vehicleType: 'motorcycle',
        vehiclePlate: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileRes, statusRes, vehicleRes] = await Promise.all([
                    shipperService.getProfile().catch(() => ({ data: null })),
                    shipperService.getShipperStatus().catch(() => ({ data: { online: false } })),
                    shipperService.getShipperVehicle().catch(() => ({ data: null }))
                ]);

                // Profile
                if (profileRes.data) {
                    const userData = profileRes.data.data || profileRes.data;
                    setProfile({
                        fullName: userData.fullName || userData.userName || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        avatar: userData.avatar || userData.avatarUrl || '',
                        id: userData.id || ''
                    });
                }

                // Status
                if (statusRes.data) {
                    setIsOnline(!!statusRes.data.online);
                }

                // Vehicle
                if (vehicleRes.data) {
                    setVehicle({
                        vehicleType: vehicleRes.data.vehicleType || 'motorcycle',
                        vehiclePlate: vehicleRes.data.vehiclePlate || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Ảnh đại diện phải dưới 2MB' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleVehicleChange = (e) => {
        setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    };

    const handleToggleStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus); // Optimistic update
        try {
            await shipperService.updateShipperStatus({ online: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
            setIsOnline(!newStatus); // Revert on failure
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể cập nhật trạng thái làm việc'
            });
        }
    };

    const handleUpdate = async () => {
        try {
            await Promise.all([
                shipperService.updateProfile(profile),
                shipperService.updateShipperVehicle(vehicle)
            ]);
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật thông tin hồ sơ và phương tiện thành công!',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Update failed', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể cập nhật thông tin'
            });
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <HeaderShipper title="Hồ sơ của tôi" />

                <main className="flex flex-1 justify-center py-8">
                    <div className="layout-content-container flex flex-col max-w-[600px] flex-1 px-4">
                        {/* Page Title & Status */}
                        <div className="flex flex-wrap justify-between items-center gap-3 pb-6">
                            <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">Hồ sơ của tôi</h1>
                            
                            {/* Online/Offline Toggle */}
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 px-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Trạng thái:</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isOnline}
                                        onChange={handleToggleStatus}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className={`ms-3 text-sm font-bold ${isOnline ? 'text-primary' : 'text-slate-400'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : (
                            <>
                                {/* Avatar Section */}
                                <div className="flex p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
                                    <div className="flex w-full flex-col gap-4 items-center sm:flex-row sm:justify-start sm:gap-6">
                                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input').click()}>
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary/20 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden" style={profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {}}>
                                                {!profile.avatar && <span className="material-symbols-outlined text-4xl text-slate-400">person</span>}
                                            </div>
                                            <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white dark:border-slate-900 cursor-pointer hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-slate-900 text-sm">photo_camera</span>
                                            </div>
                                            <input 
                                                id="avatar-input"
                                                type="file" 
                                                accept="image/*"
                                                className="hidden" 
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center sm:items-start justify-center grow">
                                            <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold">{profile.fullName || 'Chưa cập nhật'}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Mã tài xế: {profile.id ? `SP-${profile.id}` : 'XXXX'}</p>
                                            <button 
                                                onClick={() => document.getElementById('avatar-input').click()}
                                                className="mt-3 flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg mr-2">edit</span>
                                                Thay đổi ảnh
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Information Form */}
                                <div className="space-y-6">
                                    {/* Section: Basic Info */}
                                    <div>
                                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold pb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">person</span>
                                            Thông tin cơ bản
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Họ và tên</label>
                                                <input name="fullName" value={profile.fullName} onChange={handleChange} className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 outline-none" type="text" placeholder="Nhập họ và tên"/>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Số điện thoại</label>
                                                    <input name="phone" value={profile.phone} onChange={handleChange} className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 outline-none" type="tel" placeholder="Nhập số điện thoại"/>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email</label>
                                                    <input name="email" value={profile.email} onChange={handleChange} className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 outline-none" type="email" placeholder="Nhập email"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Vehicle Info */}
                                    <div>
                                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold pb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">moped</span>
                                            Thông tin phương tiện
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Loại xe</label>
                                                <select name="vehicleType" value={vehicle.vehicleType} onChange={handleVehicleChange} className="form-select rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 outline-none">
                                                    <option value="motorcycle">Xe máy</option>
                                                    <option value="truck">Xe tải nhỏ</option>
                                                    <option value="electric">Xe điện</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Biển số xe</label>
                                                <input name="vehiclePlate" value={vehicle.vehiclePlate} onChange={handleVehicleChange} className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 uppercase outline-none" type="text" placeholder="Ví dụ: 29A-12345"/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 pb-24">
                                        <button onClick={handleUpdate} className="w-full flex items-center justify-center rounded-xl bg-primary h-14 text-slate-900 text-lg font-bold hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                                            Cập nhật thông tin
                                        </button>
                                        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4 italic">
                                            Thông tin cá nhân được bảo mật theo chính sách của hệ thống.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Bottom Navigation */}
                <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
                        onClick={() => navigate('/shipper/dashboard')}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-[10px] font-bold uppercase">Tổng quan</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
                        onClick={() => navigate('/shipper/orders')}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold uppercase">Đơn hàng</span>
                    </button>
                    <button 
                        className="flex flex-col items-center gap-1 text-primary"
                    >
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-bold uppercase">Cá nhân</span>
                    </button>
                </footer>
            </div>
            {/* Map Decoration */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-5 dark:opacity-10 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgpX98VtBQEMkbfogqup1t_7AgpSVBaYbtYxuCk_kKHpbEj_r8zI--8r6ckNm6hrkYp3mJixJWogdHqD2X3oMhWICCyIuOiIDLPY40_qmlHcxNPcox7qi2lIyssotFjBy_jZw15Vk-Vs7pbDt4aT9xHbwv1Yi4Djv7XUQjHFkO-VP5pbcE7mClwmj3z2S-_Z4Cg7V-FrJK9MHXj2lDCb7kg0URBQ_0WaQ9VUtB35BODxtJgq-p17uhte6JW5pLfn1QWOKzXbVW5IjQ')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
    );
};

export default ProfileShipperPage;

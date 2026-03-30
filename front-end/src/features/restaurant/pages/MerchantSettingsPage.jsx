import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRestaurant from '../../../components/layout/SidebarRestaurant';
import HeaderRestaurant from '../../../components/layout/HeaderRestaurant';
import { useRestaurant } from '../context/RestaurantContext';
import merchantDashboardService from '../api/merchantDashboardService';
import Swal from 'sweetalert2';

const MerchantSettingsPage = () => {
    const { restaurantData, loading: contextLoading, error: contextError, fetchMyRestaurant } = useRestaurant();
    
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        address: '',
        status: 'OPEN',
        schedule: [
            { day: 'Monday', label: 'Thứ 2', isOpen: true, openTime: '08:00', closeTime: '22:00' },
            { day: 'Tuesday', label: 'Thứ 3', isOpen: true, openTime: '08:00', closeTime: '22:00' },
            { day: 'Wednesday', label: 'Thứ 4', isOpen: true, openTime: '08:00', closeTime: '22:00' },
            { day: 'Thursday', label: 'Thứ 5', isOpen: true, openTime: '08:00', closeTime: '22:00' },
            { day: 'Friday', label: 'Thứ 6', isOpen: true, openTime: '08:00', closeTime: '22:00' },
            { day: 'Saturday', label: 'Thứ 7', isOpen: true, openTime: '08:00', closeTime: '22:00' },
            { day: 'Sunday', label: 'Chủ Nhật', isOpen: true, openTime: '08:00', closeTime: '22:00' },
        ]
    });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (restaurantData) {
            setFormData(prev => ({
                ...prev,
                name: restaurantData.name || '',
                phone: restaurantData.phone || '',
                address: restaurantData.address || '',
                status: restaurantData.status || 'OPEN',
                schedule: restaurantData.schedule && restaurantData.schedule.length > 0 
                    ? restaurantData.schedule 
                    : prev.schedule
            }));
        }
    }, [restaurantData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusToggle = async () => {
        const newStatus = formData.status === 'OPEN' ? 'CLOSED' : 'OPEN';
        setFormData(prev => ({ ...prev, status: newStatus }));
        
        try {
            await merchantDashboardService.updateRestaurantStatus({ status: newStatus });
            // Soft refresh context
            fetchMyRestaurant();
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Đã chuyển trạng thái sang ${newStatus === 'OPEN' ? 'Mở cửa' : 'Đóng cửa'}`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to update status', error);
            // Revert state on error
            setFormData(prev => ({ ...prev, status: formData.status }));
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật trạng thái' });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await merchantDashboardService.updateRestaurantInfo(formData);
            fetchMyRestaurant();
            Swal.fire({
                icon: 'success',
                title: 'Đã lưu',
                text: 'Thông tin nhà hàng đã được cập nhật',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể lưu thông tin' });
        } finally {
            setIsSaving(false);
        }
    };

    if (contextError?.isNotFound) {
        return (
            <div className="bg-white text-slate-900 h-screen flex font-display">
                <SidebarRestaurant />
                <main className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-background-dark items-center justify-center p-8">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                        <div className="size-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">storefront</span>
                        </div>
                        <h2 className="text-2xl font-black mb-4">Chưa có nhà hàng được gán</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Tài khoản của bạn hiện chưa được liên kết với bất kỳ nhà hàng nào trong hệ thống. Vui lòng liên hệ Admin để được hỗ trợ.
                        </p>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="w-full py-4 bg-primary text-background-dark font-black rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                        >
                            Xem trang cá nhân
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white text-slate-900 h-screen flex font-display">
            <SidebarRestaurant />

            <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
                <HeaderRestaurant title="Cài đặt cửa hàng" />

                <div className="p-8">
                    <div className="max-w-4xl mx-auto flex flex-col gap-8">
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">Trạng thái cửa hàng</h3>
                                    <p className="text-xs text-slate-500 font-medium">Bật hoặc tắt chức năng nhận đơn ngay</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={formData.status === 'OPEN'}
                                        onChange={handleStatusToggle}
                                    />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-bold">{formData.status === 'OPEN' ? 'Đang Mở Cửa' : 'Đang Đóng Cửa'}</span>
                                </label>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span> Thông tin cơ bản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên nhà hàng</p>
                                    <input 
                                        name="name"
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary w-full py-2 px-3 text-sm font-medium outline-none" 
                                        placeholder="Tên nhà hàng" 
                                        type="text" 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</p>
                                    <input 
                                        name="phone"
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary w-full py-2 px-3 text-sm font-medium outline-none" 
                                        placeholder="Số điện thoại" 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ</p>
                                    <input 
                                        name="address"
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary w-full py-2 px-3 text-sm font-medium outline-none" 
                                        placeholder="Địa chỉ" 
                                        type="text" 
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">schedule</span> Giờ hoạt động
                            </h3>
                            <div className="space-y-4">
                                {formData.schedule.map((dayConfig, idx) => (
                                    <div key={dayConfig.day} className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                                        <div className="col-span-3 flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={dayConfig.isOpen}
                                                onChange={(e) => {
                                                    const newSchedule = [...formData.schedule];
                                                    newSchedule[idx].isOpen = e.target.checked;
                                                    setFormData({...formData, schedule: newSchedule});
                                                }}
                                                className="size-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary cursor-pointer"
                                            />
                                            <span className={`text-sm font-bold select-none ${dayConfig.isOpen ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through'}`}>{dayConfig.label}</span>
                                        </div>
                                        {dayConfig.isOpen ? (
                                            <>
                                                <div className="col-span-4">
                                                    <input 
                                                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary py-1.5 px-3 text-xs md:text-sm outline-none" 
                                                        type="time" 
                                                        value={dayConfig.openTime}
                                                        onChange={(e) => {
                                                            const newSchedule = [...formData.schedule];
                                                            newSchedule[idx].openTime = e.target.value;
                                                            setFormData({...formData, schedule: newSchedule});
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-span-1 text-center text-slate-400 text-[10px] md:text-xs font-black uppercase">Đến</div>
                                                <div className="col-span-4">
                                                    <input 
                                                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary py-1.5 px-3 text-xs md:text-sm outline-none" 
                                                        type="time" 
                                                        value={dayConfig.closeTime}
                                                        onChange={(e) => {
                                                            const newSchedule = [...formData.schedule];
                                                            newSchedule[idx].closeTime = e.target.value;
                                                            setFormData({...formData, schedule: newSchedule});
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-span-9 text-slate-400 text-sm italic opacity-70">
                                                Nghỉ đóng cửa
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                onClick={() => navigate('/merchant/dashboard')}
                                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantSettingsPage;

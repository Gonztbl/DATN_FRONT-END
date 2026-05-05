import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useState, useEffect } from "react";
import userService from "../../features/profile/api/userService";

export default function Sidebar({ activeRoute = "dashboard" }) {
    const navigate = useNavigate();
    const { user } = useAuth(); // LẤY USER ĐANG LOGIN
    const [profile, setProfile] = useState(null);


    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile for sidebar", error);
            }
        };
        fetchProfile();
    }, []);

    // Resolve Base64
    const resolveAvatarSrc = (avatar) => {
        if (!avatar) return "https://i.pravatar.cc/150?img=12";

        // Nếu đã là data:image thì dùng luôn
        if (avatar.startsWith("data:image")) return avatar;

        // Nếu là base64 thuần
        return `data:image/jpeg;base64,${avatar}`;
    };


    const navItems = [
        { id: "dashboard", icon: "grid_view", label: "Tổng quan ví", path: "/dashboard", filled: true },
        { id: "deposit", icon: "arrow_downward", label: "Nạp tiền", path: "/deposit" },
        { id: "withdraw", icon: "arrow_upward", label: "Rút tiền", path: "/withdraw" },
        { id: "receive", icon: "qr_code_scanner", label: "Nhận tiền", path: "/receive-money" },
        { id: "transactions", icon: "swap_horiz", label: "Giao dịch", path: "/transfer-history" },
        { id: "profile", icon: "person", label: "Hồ sơ", path: "/profile" },
        { id: "security", icon: "shield_person", label: "Bảo mật", path: "/security/face" },
        { id: "shopping", icon: "shopping_bag", label: "Mua sắm", path: "/shopping/food-drink" },
        { id: "loans", icon: "payments", label: "Đăng ký vay", path: "/loans/apply" },
        { id: "loans_history", icon: "history", label: "Lịch sử vay", path: "/loans/history" },
    ];




    return (
        <aside className="hidden md:flex flex-col w-72 h-full bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-800 px-4 py-3 overflow-hidden">
            {/* Top scrollable section */}
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto gap-3 pb-2 scrollbar-hide">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-2 flex-shrink-0">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={resolveAvatarSrc(profile?.avatarUrl || profile?.avatar || user?.avatar)}
                            alt="Ảnh đại diện"
                            className="w-12 h-12 rounded-full object-cover border"
                        />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <h1 className="text-sm font-semibold text-text-main dark:text-white leading-tight truncate">
                            {user?.fullName}
                        </h1>

                        {/* Membership badge */}
                        <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium
                            bg-purple-100 text-purple-700
                            dark:bg-purple-500/20 dark:text-purple-300">
                            {user?.membership || "Miễn phí"}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all w-full text-left ${activeRoute === item.id
                                ? 'bg-primary text-text-main shadow-md shadow-primary/20'
                                : 'text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-[20px]"
                                style={activeRoute === item.id && item.filled ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Section — chỉ card Nâng cấp Pro pin cố định */}
            <div className="flex-shrink-0 pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 rounded-xl p-4 border border-primary/20">
                    <h3 className="text-sm font-semibold mb-1 text-text-main dark:text-white">Nâng cấp Pro</h3>
                    <p className="text-xs text-text-sub dark:text-slate-400 mb-3">Truy cập không giới hạn mọi tính năng</p>
                    <button className="w-full bg-primary text-text-main text-sm font-medium py-1.5 px-4 rounded-full hover:bg-primary/90 transition-colors">
                        Nâng cấp ngay
                    </button>
                </div>
            </div>
        </aside>
    );
}


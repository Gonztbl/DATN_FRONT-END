import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useState, useEffect } from "react";
import userService from "../../features/profile/api/userService";

export default function Sidebar({ activeRoute = "dashboard" }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // 🔥 LẤY USER ĐANG LOGIN
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
    ];

    console.log(user.avatar);
    console.log("AUTH USER:", user);


    return (
        <aside className="hidden md:flex flex-col w-72 h-full bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-800 p-6 justify-between">
            <div className="flex flex-col gap-8">
                {/* User Profile */}
                <div className="flex items-center gap-4 px-2">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={resolveAvatarSrc(profile?.avatarUrl || profile?.avatar || user?.avatar)}
                            alt="Ảnh đại diện"
                            className="w-16 h-16 rounded-full object-cover border"
                        />

                    </div>

                    {/* User Info */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-semibold text-text-main dark:text-white leading-tight">
                            {user?.fullName}
                        </h1>

                        {/* Membership badge */}
                        <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            bg-purple-100 text-purple-700
            dark:bg-purple-500/20 dark:text-purple-300">
                            {user?.membership || "Miễn phí"}
                        </span>
                    </div>
                </div>


                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all w-full text-left ${activeRoute === item.id
                                ? 'bg-primary text-text-main shadow-md shadow-primary/20'
                                : 'text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={activeRoute === item.id && item.filled ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => handleNavigation('/settings')}
                    className="flex items-center gap-3 px-4 py-3 rounded-full text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-full text-left"
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm font-medium">Cài đặt</span>
                </button>
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 rounded-xl p-6 border border-primary/20">
                    <h3 className="text-sm font-semibold mb-2 text-text-main dark:text-white">Nâng cấp Pro</h3>
                    <p className="text-xs text-text-sub dark:text-slate-400 mb-4">Truy cập không giới hạn mọi tính năng</p>
                    <button className="w-full bg-primary text-text-main text-sm font-medium py-2 px-4 rounded-full hover:bg-primary/90 transition-colors">
                        Nâng cấp ngay
                    </button>
                </div>
            </div>
        </aside>
    );
}


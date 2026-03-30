import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const slides = [
  {
    image: "/images/wallet_3d.png",
    icon: "lock",
    category: "Xác thực",
    title: "Đăng nhập an toàn",
    heading: "Chào mừng trở lại E-Wallet",
    description: "Quản lý tài chính của bạn an toàn và hiệu quả. Truy cập bảng điều khiển để xem giao dịch và hơn thế nữa."
  },
  {
    image: "/images/dashboard_3d.png",
    icon: "analytics",
    category: "Quản lý",
    title: "Bảng điều khiển thông minh",
    heading: "Theo dõi mức chi tiêu",
    description: "Phân tích thời gian thực và lịch sử giao dịch ngay trong tầm tay bạn. Kiểm soát ngân sách tốt hơn."
  },
  {
    image: "/images/security_3d.png",
    icon: "verified_user",
    category: "Bảo vệ",
    title: "Bảo mật cấp ngân hàng",
    heading: "Tiền của bạn luôn an toàn",
    description: "Mã hóa hàng đầu bảo vệ tài sản của bạn 24/7."
  }
];

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const { showError } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError(""); // Clear error khi user nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!formData.username.trim()) {
      setLocalError("Vui lòng nhập username");
      return;
    }
    if (!formData.password.trim()) {
      setLocalError("Vui lòng nhập password");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        userName: formData.username,
        password: formData.password,
      });

      if (result.success) {
        // Check role and redirect
        // Check role and redirect
        const user = result.user;

        // Check for inactive status
        if (user && (user.status === 'INACTIVE' || user.active === false)) {
          showError("Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên.", "Tài khoản chưa kích hoạt");
          return; // Stop login process
        }

        if (user) {
          const roles = user.roles || [];
          
          if (roles.includes("ADMIN")) {
            navigate("/admin/transactions");
          } else if (roles.includes("SHIPPER")) {
            navigate("/shipper/orders");
          } else if (roles.includes("RESTAURANT_OWNER")) {
            navigate("/merchant/dashboard");
          } else {
            navigate("/dashboard");
          }
          return;
        }
      } else {
        const errorMsg = result.error?.message || "Đăng nhập thất bại";
        setLocalError(errorMsg);
        // Also show notification for wrong password or credentials
        if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('credentials') || errorMsg.includes('Sai')) {
          showError(errorMsg, "Đăng nhập thất bại");
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      setLocalError(errorMessage);
      showError(errorMessage, "Lỗi hệ thống");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display antialiased text-text-main">
      {/* LEFT */}
      <div className="flex w-full lg:w-1/2 flex-col bg-white dark:bg-background-dark h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 py-6 lg:px-12">
          <div className="size-8 text-primary">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">E-Wallet</h2>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col justify-center px-8 lg:px-24">
          <div className="max-w-[480px] w-full mx-auto flex flex-col gap-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Chào mừng trở lại</h1>
              <p className="text-base text-text-secondary mt-2">
                Đăng nhập an toàn vào ví để quản lý tài chính của bạn.
              </p>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-xl">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {displayError}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Username */}
              <div>
                <label className="text-base font-medium">Tên người dùng</label>
                <div className="relative mt-2">
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nhập tên người dùng"
                    disabled={isSubmitting}
                    className="form-input w-full h-14 rounded-xl px-4 pr-12 border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    person
                  </span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-base font-medium">Mật khẩu</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    disabled={isSubmitting}
                    className="form-input w-full h-14 rounded-xl px-4 pr-12 border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <a className="text-sm font-bold hover:text-primary" href="#">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 rounded-full bg-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-grow border-t border-border-color" />
                <span className="text-sm text-text-secondary">
                  hoặc tiếp tục với
                </span>
                <div className="flex-grow border-t border-border-color" />
              </div>

              {/* Social */}
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 h-12 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 h-12 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined">favorite</span>
                  Apple
                </button>
              </div>
            </form>

            {/* Signup */}
            <p className="text-center text-sm text-text-secondary">
              Chưa có tài khoản?
              <Link to="/register" className="ml-1 text-primary font-bold">
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-1 relative bg-[#e8f5e9] dark:bg-[#1a3324] items-center justify-center p-12 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#36e27b 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute top-10 right-10 size-64 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-10 left-10 size-80 bg-blue-400/20 rounded-full blur-[100px]"></div>
        <div className="relative z-10 max-w-xl text-center w-full">
          {/* 3D Card Illustration Carousel */}
          <div className="relative w-full aspect-square max-w-[460px] 2xl:max-w-[560px] mx-auto mb-10 group perspective-1000">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center rounded-2xl shadow-2xl transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                >
                  {/* Overlay gradient for text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">{slide.icon}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">{slide.category}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{slide.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative min-h-[140px] mt-8">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute left-0 right-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <h3 className="text-3xl lg:text-4xl font-bold text-text-dark dark:text-white mb-4">{slide.heading}</h3>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-8 z-20 relative">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-400/50 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 border border-white/50 dark:border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">security</span>
              An toàn &amp; Bảo mật
            </span>
            <span className="px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 border border-white/50 dark:border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
              Truy cập nhanh
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

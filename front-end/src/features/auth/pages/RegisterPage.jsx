import { useState, useEffect } from "react";
import RegisterService from "../api/register/registerService";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const slides = [
  {
    image: "/images/wallet_3d.png",
    icon: "lock",
    category: "Authentication",
    title: "Secure Registration",
    heading: "Financial Freedom Starts Here",
    description: "Experience the fastest, most secure way to send, spend, and save money globally. No hidden fees."
  },
  {
    image: "/images/dashboard_3d.png",
    icon: "analytics",
    category: "Management",
    title: "Smart Dashboard",
    heading: "Track Your Wealth",
    description: "Real-time analytics and transaction history at your fingertips. Stay on top of your budget."
  },
  {
    image: "/images/security_3d.png",
    icon: "verified_user",
    category: "Protection",
    title: "Bank-Grade Security",
    heading: "Your Funds Are Safe",
    description: "Industry-leading encryption protecting your assets 24/7. Peace of mind guaranteed."
  }
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [errors, setErrors] = useState({});
  const [username, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordHash, setPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // hàm validate
  const validate = () => {
    const newErrors = {};

    // USERNAME
    if (!username.trim()) {
      newErrors.userName = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) {
      newErrors.userName =
        "Username must be 4–20 chars, letters, numbers, underscore only";
    }

    // FULL NAME
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
      newErrors.fullName = "Full name is invalid";
    }

    // EMAIL
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    // PHONE
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^0\d{9,10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number is invalid";
    }

    // PASSWORD
    if (!passwordHash) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(passwordHash)) {
      newErrors.password =
        "Password must be at least 8 chars and contain letters & numbers";
    }

    // CONFIRM PASSWORD
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== passwordHash) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      const response = await RegisterService.register({
        userName: username,
        fullName,
        email,
        phone: phoneNumber,
        passwordHash,
      });

      const { accountNumber } = response.data;
      showSuccess(`Your account has been created successfully!\n\nAccount Number: ${accountNumber || phoneNumber}\n\nPlease login to continue.`, "Registration Successful");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        const message = err.response.data;

        setErrors((prev) => {
          const newErrors = { ...prev };

          if (message.includes("Email")) {
            newErrors.email = message;
          }

          if (message.includes("Username")) {
            newErrors.userName = message;
          }

          if (message.includes("Phone")) {
            newErrors.phoneNumber = message;
          }

          return newErrors;
        });
      } else {
        showError(err.response?.data?.message || "Registration failed. Please try again later.", "Server Error");
      }
    }
  };

  const inputClass = (field) =>
    `w-full px-5 py-3 h-14 text-lg rounded-xl border outline-none transition ${errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="h-screen flex flex-col md:flex-row w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light font-display antialiased">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative z-10 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="size-10 text-primary">
                <svg viewBox="0 0 48 48" fill="none">
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">E-Wallet</h2>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-black">Create your account</h1>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="User Name"
                className={inputClass("userName")}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className={inputClass("fullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                className={inputClass("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                className={inputClass("phoneNumber")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className={`${inputClass("password")} pr-12`}
                    value={passwordHash}
                    onChange={(e) => setPassWord(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className={`${inputClass("confirmPassword")} pr-12`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-text-dark font-bold text-xl h-14 flex items-center justify-center rounded-xl shadow hover:opacity-90 mt-4"
            >
              Create Free Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/Login" className="font-bold hover:text-primary">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Side: Hero Visual */}
      <div className="hidden md:flex flex-1 relative bg-[#e8f5e9] dark:bg-[#1a3324] items-center justify-center p-12 overflow-hidden">
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
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
              Instant Transfers
            </span>
            <span className="px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 border border-white/50 dark:border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">public</span>
              Global Access
            </span>
            <span className="px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 border border-white/50 dark:border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">savings</span>
              Smart Savings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

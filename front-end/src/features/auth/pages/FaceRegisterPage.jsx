import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import faceService from "../services/faceService";
import { useNotification } from "../../../context/NotificationContext";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function FaceRegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, showError } = useNotification();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { user: authUser } = useAuth(); // Lấy user từ AuthContext

    const initialPose = location.state?.pose || "front"; 
    const poseToStep = { "front": 1, "left": 2, "right": 3 };

    const [currentStep, setCurrentStep] = useState(poseToStep[initialPose] || 1); 
    const [capturedImages, setCapturedImages] = useState({}); // { front: base64, ... }
    const [loading, setLoading] = useState(false);
    const [isSinglePose] = useState(!!location.state?.pose);
    const [showFlash, setShowFlash] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            showError("Không thể mở camera. Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt.", "Lỗi Truy Cập");
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        if (!video) return null;

        const canvas = canvasRef.current;
        const targetSize = 640;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;

        const videoAspect = video.videoWidth / video.videoHeight;
        let drawWidth = targetSize;
        let drawHeight = targetSize;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspect > 1) {
            drawHeight = targetSize / videoAspect;
            offsetY = (targetSize - drawHeight) / 2;
        } else {
            drawWidth = targetSize * videoAspect;
            offsetX = (targetSize - drawWidth) / 2;
        }

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, offsetX, offsetY, drawWidth, drawHeight);
        return canvas.toDataURL("image/jpeg", 0.92);
    };

    const handleCapture = async () => {
        setLoading(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);

        const base64 = captureImage();
        if (!base64) {
            showError("Lỗi capture ảnh. Vui lòng thử lại.", "Lỗi");
            setLoading(false);
            return;
        }

        const poseMap = { 1: "front", 2: "left", 3: "right" };
        const pose = poseMap[currentStep];

        try {
            const blob = await fetch(base64).then(r => r.blob());
            const file = new File([blob], `${pose}.jpg`, { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("image", file);
            formData.append("pose", pose);
            
            // Thêm userId vào FormData (lấy từ AuthContext)
            if (authUser?.id) {
                formData.append("userId", authUser.id);
                console.log("📤 [FaceRegister] Using userId from AuthContext:", authUser.id);
            }

            // Luôn dùng registerFace cho tất cả các bước (giống admin)
            console.log("📤 [FaceRegister] Calling registerFace for pose:", pose);
            const response = await faceService.registerFace(formData);

            setCapturedImages(prev => ({ ...prev, [pose]: base64 }));
            showSuccess(`Đã lưu góc mặt ${pose.toUpperCase()}`, "Thành công");

            // Chờ một chút để user thấy ảnh vừa chụp
            if (isSinglePose || currentStep >= 3) {
                setTimeout(() => navigate("/security/face"), 1000);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } catch (err) {
            showError(err.message || "Lỗi giao tiếp với server", "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, label: "Mặt trước", icon: "face", key: "front" },
        { id: 2, label: "Quay trái", icon: "face_6", key: "left" },
        { id: 3, label: "Quay phải", icon: "face_5", key: "right" }
    ];

    return (
        <div className="relative flex min-h-screen w-full bg-[#f6f8f7] dark:bg-slate-900 font-display text-[#111714] dark:text-white transition-colors duration-300">
            <Sidebar activeRoute="security" />

            <main className="flex-1 flex flex-col items-center py-10 px-6 overflow-y-auto">
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-black leading-tight tracking-tight">Đăng ký khuôn mặt</h1>
                            <p className="text-[#648772] dark:text-slate-400">
                                {isSinglePose ? `Bổ sung góc mặt ${steps[currentStep-1].label}` : "Hoàn tất 3 bước để tối ưu nhận diện"}
                            </p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="size-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">{isDarkMode ? "light_mode" : "dark_mode"}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Camera View */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="relative aspect-[4/3] w-full rounded-3xl bg-black overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl group">
                                {/* Video Mirror View */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="h-full w-full object-cover scale-x-[-1]"
                                />

                                {/* Scanning Animation Overlay */}
                                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[320px] pointer-events-none">
                                    {/* Focus Brackets */}
                                    <div className="absolute top-0 left-0 size-16 border-t-4 border-l-4 border-primary rounded-tl-3xl opacity-60"></div>
                                    <div className="absolute top-0 right-0 size-16 border-t-4 border-r-4 border-primary rounded-tr-3xl opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 size-16 border-b-4 border-l-4 border-primary rounded-bl-3xl opacity-60"></div>
                                    <div className="absolute bottom-0 right-0 size-16 border-b-4 border-r-4 border-primary rounded-br-3xl opacity-60"></div>
                                    
                                    {/* Moving Scanning Bar */}
                                    {!loading && (
                                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(25,214,147,0.8)] animate-[nav-scan_3s_ease-in-out_infinite]" />
                                    )}
                                </div>

                                {/* Flash Effect */}
                                {showFlash && <div className="absolute inset-0 bg-white z-50 animate-pulse"></div>}

                                {/* Loading Overlay */}
                                {loading && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                                        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                                        <p className="font-bold text-primary animate-pulse">ĐANG PHÂN TÍCH...</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleCapture}
                                disabled={loading}
                                className="group relative w-full h-16 bg-primary hover:bg-emerald-400 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-slate-900 font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">photo_camera</span>
                                {loading ? "ĐANG XỬ LÝ..." : `CHỤP ẢNH ${steps[currentStep - 1].label?.toUpperCase()}`}
                            </button>
                        </div>

                        {/* Right: Steps & Progress */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    Tiến trình
                                </h3>
                                
                                <div className="flex flex-col gap-6">
                                    {steps.map((step) => {
                                        const isDone = capturedImages[step.key] || (currentStep > step.id && !isSinglePose);
                                        const isCurrent = currentStep === step.id;
                                        
                                        return (
                                            <div 
                                                key={step.id} 
                                                className={`flex items-center gap-4 transition-all ${isCurrent ? "scale-105" : "opacity-60"}`}
                                            >
                                                <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${
                                                    isDone ? "bg-primary text-slate-900" : 
                                                    isCurrent ? "bg-primary/20 text-primary border-2 border-primary" : 
                                                    "bg-slate-100 dark:bg-slate-900 text-slate-400"
                                                }`}>
                                                    <span className="material-symbols-outlined">
                                                        {isDone ? "check" : step.icon}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-black ${isCurrent ? "text-primary" : ""}`}>
                                                        {step.label}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {isDone ? "Đã hoàn tất" : isCurrent ? "Đang chờ chụp..." : "Chưa chụp"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-emerald-500/10 dark:bg-emerald-400/5 rounded-3xl p-6 border border-emerald-500/20">
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 leading-relaxed">
                                    💡 <b>Mẹo:</b> Giữ khuôn mặt ổn định trong khung hình, đảm bảo ánh sáng tốt và không đeo kính đen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
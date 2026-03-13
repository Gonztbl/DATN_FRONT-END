// FaceRegisterPage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import faceService from "../services/faceService";
import { useNotification } from "../../../context/NotificationContext";

export default function FaceRegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, showError } = useNotification();

    const initialPose = location.state?.pose || "front"; // nếu truyền từ ADD NOW
    const poseToStep = { "front": 1, "left": 2, "right": 3 };

    const [currentStep, setCurrentStep] = useState(poseToStep[initialPose] || 1); 
    const [capturedImages, setCapturedImages] = useState({}); // { front: base64, ... }
    const [loading, setLoading] = useState(false);
    const [isSinglePose, setIsSinglePose] = useState(!!location.state?.pose);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => {
            // Cleanup camera khi thoát trang
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            showError("Không thể mở camera. Vui lòng cấp quyền.", "Lỗi");
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
        ctx.imageSmoothingQuality = 'high';

        // Center crop vuông từ video (giữ nguyên tỷ lệ)
        const videoAspect = video.videoWidth / video.videoHeight;
        let drawWidth = targetSize;
        let drawHeight = targetSize;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspect > 1) { // video ngang
            drawHeight = targetSize / videoAspect;
            offsetY = (targetSize - drawHeight) / 2;
        } else { // video dọc hoặc vuông
            drawWidth = targetSize * videoAspect;
            offsetX = (targetSize - drawWidth) / 2;
        }

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
                      offsetX, offsetY, drawWidth, drawHeight);

        return canvas.toDataURL("image/jpeg", 0.92); // Tăng quality lên 92%
    };

    const handleCapture = async () => {
        setLoading(true);
        const base64 = captureImage();
        if (!base64) {
            showError("Không chụp được ảnh", "Lỗi");
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
            // faceService sẽ tự động thêm userId nếu thiếu

            await faceService.registerFace(formData);
            showSuccess(`Đăng ký pose ${pose.toUpperCase()} thành công!`, "Hoàn tất");

            setCapturedImages(prev => ({ ...prev, [pose]: base64 }));

            if (isSinglePose || currentStep >= 3) {
                // Hoàn tất nếu là pose đơn lẻ hoặc đã xong bước cuối
                const msg = isSinglePose ? `Đã cập nhật pose ${pose.toUpperCase()}` : "Đăng ký hoàn tất 3 pose!";
                showSuccess(msg, "Thành công");
                navigate("/security/face");
            } else {
                setCurrentStep(currentStep + 1);
            }
        } catch (err) {
            console.error("FE caught error:", err);
            showError(err.message || "Lỗi không xác định", "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    const getStepTitle = () => {
        const titles = ["", "Front Pose", "Left Pose", "Right Pose"];
        return titles[currentStep];
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="flex flex-1">
                <Sidebar activeRoute="security" />

                <main className="flex-1 flex flex-col items-center py-8 px-6">
                    <div className="w-full max-w-4xl">
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-between mb-12 px-2">
                            {[1, 2, 3, 4].map(step => (
                                <div key={step} className="flex flex-col items-center gap-2 flex-1">
                                    <div className={`size-10 rounded-full flex items-center justify-center text-sm font-bold ${step <= currentStep ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(25,230,107,0.4)]" : "bg-slate-200 dark:bg-slate-800 opacity-50"}`}>
                                        {step}
                                    </div>
                                    <span className={`text-xs ${step <= currentStep ? "font-bold" : "font-medium opacity-50"}`}>
                                        {step === 1 ? "Prepare" : step === 2 ? "Front" : step === 3 ? "Left" : "Right"}
                                    </span>
                                    {step < 4 && (
                                        <div className={`h-[2px] flex-1 mx-4 ${step < currentStep ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Left - Instructions */}
                            <div className="lg:col-span-5 space-y-6">
                                <div>
                                    <h1 className="text-4xl font-bold leading-tight mb-4">{getStepTitle()}</h1>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                        Position your face within the green oval and look directly at the camera. 
                                        Đảm bảo ánh sáng tốt, mặt rõ nét, không rung tay.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                        <span className="material-symbols-outlined text-primary">light_mode</span>
                                        <p className="text-sm">Avoid backlighting or heavy shadows on your face.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                        <span className="material-symbols-outlined text-primary">face</span>
                                        <p className="text-sm">Keep a neutral expression and remove sunglasses or masks.</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleCapture}
                                        disabled={loading}
                                        className={`w-full bg-primary text-background-dark font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Đang xử lý..." : "Start Capture"}
                                    </button>
                                </div>
                            </div>

                            {/* Right - Camera Preview */}
                            <div className="lg:col-span-7">
                                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl ring-8 ring-primary/5">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <canvas ref={canvasRef} className="hidden" />

                                    {/* Green Oval Overlay */}
                                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                        <div className="w-64 h-80 face-oval-overlay" />
                                    </div>

                                    {/* Live Preview Badge */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 bg-primary rounded-full animate-pulse" />
                                            <span className="text-white text-xs font-medium uppercase tracking-widest">Live Preview</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-center mt-6 text-slate-500 dark:text-slate-400 text-sm italic">
                                    Data is processed locally and securely encrypted.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="mt-auto py-8 border-t border-primary/5 text-center text-slate-400 text-xs">
                © 2024 SmartPay Biometrics. All rights reserved.
            </footer>
        </div>
    );
}
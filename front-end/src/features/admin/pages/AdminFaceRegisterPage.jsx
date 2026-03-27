import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SidebarAdmin from "../../../components/layout/SidebarAdmin";
import HeaderAdmin from "../../../components/layout/HeaderAdmin";
import faceService from "../../auth/services/faceService";
import userManageService from "../api/userManageService";
import { useNotification } from "../../../context/NotificationContext";

export default function AdminFaceRegisterPage() {
    const { id } = useParams(); // target user id
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();

    const [user, setUser] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Front, 2: Left, 3: Right
    const [loading, setLoading] = useState(false);
    const [capturedImages, setCapturedImages] = useState({});

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const u = await userManageService.getUserById(id);
                setUser(u);
            } catch (err) {
                console.warn("Could not fetch target user info", err);
            }
        };
        if (id) fetchUser();
    }, [id]);

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
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            showError("We could not access your camera.", "Lỗi");
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
        try {
            const base64 = captureImage();
            if (!base64) throw new Error("Could not capture image from camera.");

            const poseMap = { 1: "front", 2: "left", 3: "right" };
            const pose = poseMap[currentStep];

            const blob = await fetch(base64).then(r => r.blob());
            const file = new File([blob], `${pose}.jpg`, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);
            formData.append("pose", pose);
            formData.append("userId", id);

            await faceService.registerFace(formData);
            showSuccess(`Đăng ký tư thế ${pose.toUpperCase()} thành công!`, "Hoàn tất");

            setCapturedImages(prev => ({ ...prev, [pose]: base64 }));

            if (currentStep >= 3) {
                showSuccess("Đăng ký hoàn tất cả 3 tư thế!", "Thành công");
                navigate(`/admin/users/${id}`);
            } else {
                setCurrentStep(currentStep + 1);
            }
        } catch (err) {
            showError(err.message || "Lỗi khi đăng ký khuôn mặt", "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    const getStepTitle = () => {
        const titles = ["", "Chụp Ảnh Chính Diện", "Quay Mặt Sang Trái", "Quay Mặt Sang Phải"];
        return titles[currentStep];
    };

    const getStepGuidance = () => {
        const guidance = [
            "",
            "Vui lòng nhìn thẳng vào camera, giữ khuôn mặt trong khung hình.",
            "Vui lòng từ từ quay mặt sang bên trái (khoảng 45 độ).",
            "Vui lòng từ từ quay mặt sang bên phải (khoảng 45 độ)."
        ];
        return guidance[currentStep];
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-display">
            <SidebarAdmin />
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
                <HeaderAdmin title="User Management" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto flex flex-col gap-6">
                        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-display">
                            <Link to="/user-manager" className="hover:text-primary transition-colors">Users</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link to={`/admin/users/${id}`} className="hover:text-primary transition-colors">
                                User Details
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium">Register Biometrics</span>
                        </nav>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent mb-2">
                                Face Registration
                            </h2>
                            <p className="text-slate-500 font-medium">
                                Registering biometrics for: <strong className="text-slate-900 dark:text-slate-200">{user?.fullName || user?.userName || `ID: ${id}`}</strong>
                            </p>
                        </div>

                        {/* Progress Stepper */}
                        <div className="flex items-center justify-center gap-4 mb-12 max-w-2xl mx-auto">
                            {[1, 2, 3].map(step => (
                                <div key={step} className="flex items-center gap-3 flex-1">
                                    <div className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step <= currentStep ? "bg-primary text-white shadow-[0_0_15px_rgba(25,230,107,0.4)] scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                                        {step === 1 ? <span className="material-symbols-outlined text-sm">face</span> : 
                                         step === 2 ? <span className="material-symbols-outlined text-sm">arrow_back</span> : 
                                         <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] uppercase tracking-tighter font-bold ${step <= currentStep ? "text-primary" : "text-slate-400"}`}>Pose {step}</span>
                                        <span className={`text-xs font-bold leading-none ${step <= currentStep ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>
                                            {step === 1 ? "Front" : step === 2 ? "Left" : "Right"}
                                        </span>
                                    </div>
                                    {step < 3 && <div className={`h-0.5 flex-1 mx-2 rounded-full ${step < currentStep ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"}`} />}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                            {/* Camera Area */}
                            <div className="md:col-span-7 space-y-4">
                                <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl ring-4 ring-primary/5">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <canvas ref={canvasRef} className="hidden" />
                                    
                                    {/* Green Oval Overlay */}
                                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                        <div className="w-56 h-72 border-2 border-primary/40 border-dashed rounded-[100px] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                                    </div>

                                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <span className="size-2 bg-primary rounded-full animate-pulse" /> LIVE
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleCapture}
                                    disabled={loading}
                                    className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 transform active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-3 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            REGISTERING...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">photo_camera</span>
                                            CAPTURE {getStepTitle().toUpperCase()}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Info Area */}
                            <div className="md:col-span-5 flex flex-col gap-6">
                                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined">lightbulb</span>
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Instructions</h3>
                                    </div>
                                    <h4 className="text-xl font-bold text-primary mb-2">{getStepTitle()}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                        {getStepGuidance()}
                                    </p>
                                    <div className="mt-6 space-y-3">
                                        {[
                                            { icon: "wb_sunny", text: "Ensure bright, even lighting" },
                                            { icon: "face", text: "Neutral facial expression" },
                                            { icon: "no_photography", text: "Remove glasses or masks" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined !text-base text-primary/60">{item.icon}</span>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview of captured poses */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3].map(step => {
                                        const pose = step === 1 ? "front" : step === 2 ? "left" : "right";
                                        const img = capturedImages[pose];
                                        return (
                                            <div key={step} className="flex flex-col gap-2">
                                                <div className={`aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 ${img ? "border-primary" : "border-transparent"}`}>
                                                    {img ? (
                                                        <img src={img} alt={pose} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center opacity-20">
                                                            <span className="material-symbols-outlined">image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black text-center uppercase tracking-tighter text-slate-400">{pose}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
    );
}

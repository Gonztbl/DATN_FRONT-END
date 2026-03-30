import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import SidebarAdmin from "../../../components/layout/SidebarAdmin";
import HeaderAdmin from "../../../components/layout/HeaderAdmin";
import faceService from "../../auth/services/faceService";
import userManageService from "../api/userManageService";
import { useNotification } from "../../../context/NotificationContext";

export default function AdminVerifyFacePage() {
    const { id } = useParams(); // target user id
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useNotification();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Lấy thông tin user để hiển thị tên
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
            showError("Không thể truy cập camera của bạn.", "Lỗi");
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

    const handleVerify = async () => {
        setVerifying(true);
        setResult(null);
        try {
            const base64 = captureImage();
            if (!base64) throw new Error("Không thể chụp ảnh từ camera.");

            const blob = await fetch(base64).then(r => r.blob());
            const file = new File([blob], "verify.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("image", file);
            
            // Bắt buộc truyền ID người dùng đang được test để so sánh đúng với embeddings của người đó
            formData.append("userId", id);

            const res = await faceService.verifyFace(formData);
            
            if (res.result === "PASS") {
                setResult({
                    success: true,
                    message: "Xác thực khuôn mặt thành công! Khớp với dữ liệu người dùng.",
                    confidence: res.similarity || null
                });
                showSuccess("Xác thực thành công", "Thành công");
            } else {
                setResult({
                    success: false,
                    message: res.message || "Khuôn mặt không khớp với người dùng.",
                    errorDetail: res.error || null
                });
                showWarning("Xác thực thất bại", "Cảnh báo");
            }
        } catch (err) {
            setResult({
                success: false,
                message: err.message || "Đã xảy ra lỗi trong quá trình xác thực."
            });
            showError("Lỗi hệ thống", "Lỗi");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-display">
            <SidebarAdmin />
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
                <HeaderAdmin title="Quản lý người dùng" />

                <div className="p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto flex flex-col gap-6">
                        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-display">
                            <Link to="/user-manager" className="hover:text-primary transition-colors">Người dùng</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link to={`/admin/users/${id}`} className="hover:text-primary transition-colors">
                                Chi tiết người dùng
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium">Kiểm tra xác thực</span>
                        </nav>

                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
                                Kiểm tra xác thực khuôn mặt
                            </h2>
                            <p className="text-slate-500">
                                Thử nghiệm xác thực sinh trắc học cho: <strong>{user?.fullName || user?.userName || `ID: ${id}`}</strong>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Camera Area */}
                            <div className="space-y-4">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <canvas ref={canvasRef} className="hidden" />
                                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                        <div className="w-48 h-64 border-2 border-primary/50 border-dashed rounded-[100px] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                                    </div>
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium flex items-center gap-2">
                                        <span className="size-2 bg-red-500 rounded-full animate-pulse" /> TRỰC TIẾP
                                    </div>
                                </div>
                                <button
                                    onClick={handleVerify}
                                    disabled={verifying}
                                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                                >
                                    {verifying ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            Đang xác thực...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">face</span>
                                            Thử nghiệm nhận diện
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Result Area */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 h-full border border-slate-100 dark:border-slate-700 min-h-[300px] flex flex-col justify-center">
                                {!result ? (
                                    <div className="text-center text-slate-400">
                                        <span className="material-symbols-outlined !text-6xl mb-2 opacity-50">data_object</span>
                                        <p>Kết quả sẽ hiển thị ở đây</p>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4 animate-in zoom-in duration-300">
                                        <div className={`mx-auto size-20 rounded-full flex items-center justify-center ${result.success ? "bg-emerald-100 text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "bg-red-100 text-red-600 shadow-[0_0_30px_rgba(239,68,68,0.2)]"}`}>
                                            <span className="material-symbols-outlined !text-5xl">
                                                {result.success ? "check_circle" : "error"}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${result.success ? "text-emerald-600" : "text-red-600"}`}>
                                                {result.success ? "Khớp dữ liệu" : "Không khớp"}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                                                {result.message}
                                            </p>
                                            {result.success && result.confidence && (
                                                <div className="mt-4 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg inline-block">
                                                    <span className="text-sm font-bold text-emerald-700">Độ tương đồng: {(result.confidence * 100).toFixed(2)}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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

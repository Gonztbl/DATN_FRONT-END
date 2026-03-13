import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar"; // Giả định bạn đã có
import faceService from "../services/faceService"; // Service mới để gọi API face
import { useNotification } from "../../../context/NotificationContext";

export default function FaceAuthenticationPage() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [loading, setLoading] = useState(true);
    const [embeddings, setEmbeddings] = useState([]); // Danh sách embeddings đã đăng ký
    const [isRegistering, setIsRegistering] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: front, 2: left, 3: right, 4: success
    const [capturedImages, setCapturedImages] = useState({}); // { front: base64, left: base64, right: base64 }
    const [verifyResult, setVerifyResult] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Load danh sách embeddings khi mount
    useEffect(() => {
        const fetchEmbeddings = async () => {
            try {
                // Giả định API trả về list cho user hiện tại (hoặc truyền userId nếu cần)
                const data = await faceService.listEmbeddings(); // GET /api/face/list/{userId}
                setEmbeddings(data || []);
            } catch (err) {
                showError("Không thể tải danh sách khuôn mặt", "Lỗi");
            } finally {
                setLoading(false);
            }
        };
        fetchEmbeddings();
    }, []);

    // Khởi động camera khi bắt đầu đăng ký hoặc verify
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            showError("Không thể truy cập camera. Vui lòng cấp quyền.", "Lỗi Camera");
        }
    };

    // Capture ảnh từ video → base64
    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg");
    };

    // Bắt đầu quá trình đăng ký
    const handleStartRegister = () => {
        setIsRegistering(true);
        setCurrentStep(1); // Bắt đầu từ pose front
        startCamera();
    };

    // Chụp pose hiện tại và chuyển bước
    const handleCapturePose = async () => {
        const base64 = captureImage();
        if (!base64) return;

        const pose = currentStep === 1 ? "front" : currentStep === 2 ? "left" : "right";
        setCapturedImages((prev) => ({ ...prev, [pose]: base64 }));

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Hoàn tất → gửi đăng ký từng pose
            await registerAllPoses();
        }
    };

    // Gửi đăng ký từng pose lên server
    const registerAllPoses = async () => {
        setLoading(true);
        try {
            for (const [pose, base64] of Object.entries(capturedImages)) {
                const blob = await (await fetch(base64)).blob();
                const file = new File([blob], `${pose}.jpg`, { type: "image/jpeg" });

                const formData = new FormData();
                formData.append("image", file);
                formData.append("pose", pose);
                // userId lấy từ context hoặc profile nếu cần

                await faceService.registerFace(formData); // POST /api/face/register
            }
            showSuccess("Đăng ký khuôn mặt thành công!", "Hoàn tất");
            // Refresh list
            const data = await faceService.listEmbeddings();
            setEmbeddings(data || []);
            setIsRegistering(false);
            setCurrentStep(0);
            setCapturedImages({});
        } catch (err) {
            showError("Đăng ký thất bại. Vui lòng thử lại.", "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    // Xóa một embedding
    const handleDeleteEmbedding = async (embeddingId) => {
        if (!confirm("Bạn có chắc muốn xóa embedding này?")) return;
        try {
            await faceService.deleteEmbedding(embeddingId); // DELETE /api/face/{embeddingId}
            showSuccess("Đã xóa thành công", "Thành công");
            setEmbeddings(embeddings.filter((e) => e.id !== embeddingId));
        } catch (err) {
            showError("Xóa thất bại", "Lỗi");
        }
    };

    // Kiểm tra verify (test nhanh)
    const handleVerifyTest = async () => {
        setLoading(true);
        try {
            const base64 = captureImage();
            if (!base64) throw new Error("Không chụp được ảnh");

            const blob = await (await fetch(base64)).blob();
            const file = new File([blob], "test.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);
            // userId nếu cần

            const result = await faceService.verifyFace(formData); // POST /api/face/verify
            setVerifyResult(result);
            if (result.result === "PASS") {
                showSuccess(`Xác thực thành công! Similarity: ${result.similarity.toFixed(2)}`, "Thành công");
            } else {
                showError("Không khớp. Vui lòng thử lại.", "Xác thực thất bại");
            }
        } catch (err) {
            showError("Kiểm tra thất bại", "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;

    const hasRegistered = embeddings.length > 0;
    const registeredPoses = embeddings.map((e) => e.pose);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Header giống hệt mẫu */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-slate-900">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">SmartPay</h2>
                </div>
                <div className="flex gap-2">
                    <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeRoute="security" /> {/* Giả định route security hoặc profile */}

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Breadcrumbs */}
                        <nav className="flex flex-wrap gap-2 py-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                Quay lại Profile
                            </button>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">Face Authentication</span>
                        </nav>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Face Authentication</h1>

                        {/* Status Card */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 bg-slate-100 dark:bg-slate-800 min-h-[220px] flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                    <span className={`material-symbols-outlined text-8xl ${hasRegistered ? "text-primary" : "text-slate-400"}`}>
                                        {hasRegistered ? "face" : "face_retouching_off"}
                                    </span>
                                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-opacity-90"
                                        style={{ backgroundColor: hasRegistered ? "#19e66b" : "#ef4444", color: "white" }}>
                                        {hasRegistered ? `Đã đăng ký (${embeddings.length}/3)` : "Chưa đăng ký"}
                                    </div>
                                </div>

                                <div className="flex-1 p-6 md:p-8 space-y-6">
                                    <div>
                                        <p className="text-xl font-bold">{hasRegistered ? "Đã kích hoạt" : "Chưa kích hoạt"}</p>
                                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                                            {hasRegistered
                                                ? "Bạn đã đăng ký khuôn mặt thành công. Sử dụng để xác thực giao dịch nhanh chóng và an toàn."
                                                : "Thêm lớp bảo mật bằng khuôn mặt – thanh toán chỉ cần nhìn vào camera."}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {!isRegistering && (
                                            <button
                                                onClick={handleStartRegister}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary font-bold text-slate-900 hover:opacity-90 transition shadow-lg shadow-primary/20"
                                            >
                                                <span className="material-symbols-outlined">photo_camera</span>
                                                {hasRegistered ? "Đăng ký thêm pose" : "Đăng ký ngay"}
                                            </button>
                                        )}
                                        {hasRegistered && (
                                            <button
                                                onClick={handleVerifyTest}
                                                disabled={loading}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium transition"
                                            >
                                                <span className="material-symbols-outlined">verified_user</span>
                                                Kiểm tra ngay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Camera + Registration Wizard */}
                        {(isRegistering || verifyResult) && (
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <canvas ref={canvasRef} className="hidden" />
                                    {/* Overlay oval */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-3/5 aspect-square rounded-full border-4 border-primary/60 animate-pulse" />
                                    </div>
                                    {/* Hướng dẫn pose */}
                                    {isRegistering && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-3 rounded-full text-lg font-medium">
                                            {currentStep === 1 && "Nhìn thẳng vào camera (Front)"}
                                            {currentStep === 2 && "Quay mặt sang trái 30-45°"}
                                            {currentStep === 3 && "Quay mặt sang phải 30-45°"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center gap-4">
                                    {isRegistering && (
                                        <button
                                            onClick={handleCapturePose}
                                            disabled={loading}
                                            className="px-8 py-4 rounded-full bg-primary text-slate-900 font-bold text-lg hover:opacity-90 transition"
                                        >
                                            Chụp ảnh
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsRegistering(false);
                                            setCurrentStep(0);
                                            setCapturedImages({});
                                        }}
                                        className="px-8 py-4 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium transition"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Danh sách embeddings đã đăng ký */}
                        {hasRegistered && !isRegistering && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Khuôn mặt đã đăng ký</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {embeddings.map((emb) => (
                                        <div
                                            key={emb.id}
                                            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold capitalize">{emb.pose}</span>
                                                <span className="text-xs text-slate-500">{new Date(emb.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteEmbedding(emb.id)}
                                                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                                Xóa pose này
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Verify Result */}
                        {verifyResult && (
                            <div className={`p-6 rounded-xl border ${verifyResult.result === "PASS" ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-red-500 bg-red-50 dark:bg-red-950/30"}`}>
                                <h3 className="text-xl font-bold mb-2">
                                    {verifyResult.result === "PASS" ? "Xác thực thành công" : "Không khớp"}
                                </h3>
                                <p>Similarity: <strong>{verifyResult.similarity.toFixed(3)}</strong> (ngưỡng: {verifyResult.threshold})</p>
                                <p>Khớp với pose: <strong>{verifyResult.matchedPose}</strong></p>
                                <p className="mt-2">{verifyResult.message}</p>
                            </div>
                        )}

                        {/* Benefits & Privacy */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                            <div className="p-6 rounded-xl border bg-white dark:bg-slate-900">
                                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                    <span className="material-symbols-outlined text-3xl">bolt</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Nhanh chóng</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Xác thực chỉ trong 1-2 giây.</p>
                            </div>
                            {/* Thêm 2 card khác tương tự */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
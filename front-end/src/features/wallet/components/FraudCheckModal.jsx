import React, { useState, useRef, useEffect } from "react";
import faceService from "../../auth/services/faceService";
import { useAuth } from "../../auth/context/AuthContext";
import { showSuccess } from "../../../utils/swalUtils";

export default function FraudCheckModal({ isOpen, fraudResult, onConfirm, onCancel }) {
    const { user } = useAuth();
    const [verifying, setVerifying] = useState(false);
    const [faceVerified, setFaceVerified] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setVerifying(false);
            setFaceVerified(false);
            setCameraActive(false);
            setErrorMsg("");
        } else {
            stopCamera();
        }
        return stopCamera;
    }, [isOpen, fraudResult]);

    useEffect(() => {
        if (cameraActive) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [cameraActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setErrorMsg("Không thể truy cập camera. Vui lòng kiểm tra quyền.");
            setCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleCaptureAndVerify = async () => {
        const video = videoRef.current;
        if (!video) return;

        setVerifying(true);
        setErrorMsg("");

        try {
            const canvas = canvasRef.current;
            // Use native video resolution to avoid blurriness from resizing
            const width = video.videoWidth;
            const height = video.videoHeight;
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            
            // Draw the full frame without any cropping or complex logic
            // This ensures the Backend receives the highest quality raw image
            ctx.drawImage(video, 0, 0, width, height);
            
            // Get base64 with high quality
            const base64 = canvas.toDataURL("image/jpeg", 0.95);

            const blob = await fetch(base64).then(r => r.blob());
            const file = new File([blob], "verify.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("image", file);
            
            // Pass userId for more reliable target matching
            if (user?.id || user?.userId) {
                formData.append("userId", user.id || user.userId);
            }

            // Call verify API (exactly like the registration flow uses FormData)
            const result = await faceService.verifyFace(formData);
            
            // Check success exactly as AdminVerifyFacePage.jsx does (res.result === "PASS")
            if (result && (result.result === "PASS" || result.match === true)) {
                setFaceVerified(true);
                showSuccess("Xác thực thành công", "Vui lòng nhấn Xác nhận để hoàn tất giao dịch.");
                stopCamera();
                setCameraActive(false);
            } else {
                setErrorMsg(result.message || "Xác thực khuôn mặt không khớp. Vui lòng thử lại.");
            }
        } catch (err) {
            setErrorMsg(err.message || "Lỗi xác thực.");
        } finally {
            setVerifying(false);
        }
    };

    if (!isOpen || !fraudResult) return null;

    const { fraudZone, fraudScore, message } = fraudResult;
    const scorePct = (fraudScore * 100).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className={`p-6 text-center text-white ${
                    fraudZone === 'ACCEPT' ? 'bg-green-500' :
                    fraudZone === 'REVIEW' ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                    <span className="material-symbols-outlined text-5xl mb-2">
                        {fraudZone === 'ACCEPT' ? 'verified_user' :
                         fraudZone === 'REVIEW' ? 'warning' : 'gpp_bad'}
                    </span>
                    <h2 className="text-2xl font-black uppercase">
                        {fraudZone === 'ACCEPT' ? 'Giao dịch an toàn' :
                         fraudZone === 'REVIEW' ? 'Phát hiện rủi ro' : 'Bị từ chối'}
                    </h2>
                </div>

                <div className="p-6">
                    <p className="text-center text-slate-700 dark:text-slate-300 font-medium mb-6">
                        {message}
                    </p>

                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-3 rounded-xl mb-6">
                        <span className="text-sm font-bold text-slate-500">Mức độ rủi ro AI:</span>
                        <span className={`font-black text-lg ${
                            fraudZone === 'ACCEPT' ? 'text-green-500' :
                            fraudZone === 'REVIEW' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                            {scorePct}%
                        </span>
                    </div>

                    {/* Camera view for REVIEW zone */}
                    {fraudZone === 'REVIEW' && !faceVerified && (
                        <div className="mb-6 flex flex-col items-center">
                            {cameraActive ? (
                                <div className="space-y-4 w-full">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black ring-4 ring-amber-500/20">
                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover origin-center" style={{ transform: 'scaleX(-1)' }} />
                                        <canvas ref={canvasRef} className="hidden" />
                                        <div className="absolute inset-0 border-2 border-dashed border-amber-500/50 rounded-full m-8 pointer-events-none" />
                                    </div>
                                    <button 
                                        onClick={handleCaptureAndVerify}
                                        disabled={verifying}
                                        className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {verifying ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">face_retouching_natural</span>}
                                        {verifying ? "Đang xác thực..." : "Chụp & Xác thực"}
                                    </button>
                                    {errorMsg && <p className="text-red-500 text-xs text-center font-bold px-2">{errorMsg}</p>}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setCameraActive(true)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 flex justify-center items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">camera_alt</span>
                                    Bật Camera Xác Thực
                                </button>
                            )}
                        </div>
                    )}

                    {/* Face Verified Success message */}
                    {fraudZone === 'REVIEW' && faceVerified && (
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-xl mb-6 flex items-center justify-center gap-2 font-bold text-sm">
                            <span className="material-symbols-outlined">check_circle</span>
                            Xác minh khuôn mặt thành công
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button 
                            onClick={onCancel}
                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            {fraudZone === 'REJECT' ? 'Đã hiểu' : 'Hủy bỏ'}
                        </button>
                        
                        {fraudZone !== 'REJECT' && (
                            <button 
                                onClick={() => onConfirm(fraudResult.sessionToken, faceVerified)}
                                disabled={(fraudZone === 'REVIEW' && !faceVerified) || cameraActive}
                                className={`flex-1 font-bold py-3 rounded-xl text-white transition ${
                                    (fraudZone === 'REVIEW' && !faceVerified) || cameraActive
                                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                                        : 'bg-primary hover:bg-emerald-600 shadow-lg shadow-primary/20'
                                }`}
                            >
                                Xác Nhận Chuyển
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

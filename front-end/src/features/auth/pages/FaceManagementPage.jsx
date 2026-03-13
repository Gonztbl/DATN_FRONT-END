// FaceManagementPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import faceService from "../services/faceService"; // dùng service hiện có
import { useNotification } from "../../../context/NotificationContext";

export default function FaceManagementPage() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [embeddings, setEmbeddings] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // faceService sẽ tự động lấy userId từ /api/me nếu ta không truyền gì
                const data = await faceService.listEmbeddings();
                setEmbeddings(data || []);
            } catch (err) {
                console.error("Load embeddings error:", err);
                const errorMsg = err.response?.data?.message || "Không tải được danh sách khuôn mặt";
                showError(errorMsg, "Lỗi");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAddPose = (pose = null) => {
        navigate("/security/face/register", { state: { pose } }); 
    };

    const handleReRegisterAll = async () => {
        if (!confirm("Bạn có chắc muốn xóa và đăng ký lại toàn bộ?")) return;
        try {
            // Xóa tất cả trước (nếu backend hỗ trợ bulk delete)
            for (const emb of embeddings) {
                await faceService.deleteEmbedding(emb.id);
            }
            showSuccess("Đã xóa toàn bộ. Vui lòng đăng ký lại.", "Thành công");
            setEmbeddings([]);
            // Sau đó có thể tự động mở flow đăng ký mới
        } catch (err) {
            console.error("Re-register error:", err);
            const errorMsg = err.response?.data?.message || "Xóa thất bại";
            showError(errorMsg, "Lỗi");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Xóa pose này?")) return;
        try {
            await faceService.deleteEmbedding(id);
            showSuccess("Đã xóa pose", "Thành công");
            setEmbeddings(embeddings.filter(e => e.id !== id));
        } catch (err) {
            console.error("Delete pose error:", err);
            const errorMsg = err.response?.data?.message || "Xóa thất bại";
            showError(errorMsg, "Lỗi");
        }
    };

    const missingPoses = ["front", "left", "right"].filter(p => !embeddings.some(e => e.pose === p));

    if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeRoute="security" />

                <main className="flex-1 py-8 px-4 md:px-10 overflow-y-auto">
                    <div className="max-w-[1024px] mx-auto flex flex-col gap-6">
                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-bold">Face Management</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Secure your payments with multi-angle facial recognition data.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReRegisterAll}
                                    className="flex h-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-4 text-sm font-bold bg-white dark:bg-slate-900 hover:bg-slate-50"
                                >
                                    Re-register All
                                </button>
                                <button
                                    onClick={() => handleAddPose()}
                                    className="flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-slate-900 hover:opacity-90 transition-opacity"
                                >
                                    <span className="material-symbols-outlined mr-2 text-[20px]">add_a_photo</span>
                                    Add New Pose
                                </button>
                            </div>
                        </div>

                        {/* Warning Missing Poses */}
                        {missingPoses.length > 0 && (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/30 p-5">
                                <div className="flex gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-base font-bold">Missing Poses Detected</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            For high-security verification, we require Left, Front, and Right profiles.
                                            Missing: {missingPoses.join(", ").toUpperCase()}.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddPose()}
                                    className="flex min-w-[140px] h-9 items-center justify-center rounded-lg bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-colors"
                                >
                                    Complete Profile
                                </button>
                            </div>
                        )}

                        {/* Table Embeddings */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-sm font-semibold">Pose Angle</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Registration Date</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {embeddings.map((emb) => (
                                            <tr key={emb.id}>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                            <span className="material-symbols-outlined">face_retouching_natural</span>
                                                        </div>
                                                        <span className="font-medium capitalize">{emb.pose}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                                                        Registered
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(emb.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDelete(emb.id)}
                                                        className="text-red-500 hover:text-red-600 font-bold text-sm tracking-wide"
                                                    >
                                                        DELETE
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Missing poses rows */}
                                        {["front", "left", "right"].map((pose) =>
                                            !embeddings.some(e => e.pose === pose) ? (
                                                <tr key={pose} className="bg-slate-50/30 dark:bg-slate-800/20">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                                                <span className="material-symbols-outlined">help_center</span>
                                                            </div>
                                                            <span className="font-medium capitalize">{pose}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            Not Registered
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-slate-400">—</td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            onClick={() => handleAddPose(pose)}
                                                            className="text-primary hover:opacity-80 font-bold text-sm tracking-wide"
                                                        >
                                                            ADD NOW
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : null
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Benefits Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-3 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-primary size-8">shield</span>
                                <h3 className="font-bold">Secure Storage</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Your biometric data is encrypted and stored locally on your device's secure enclave.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-primary size-8">analytics</span>
                                <h3 className="font-bold">High Accuracy</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Multi-angle poses reduce false rejections and improve recognition speed in low light.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-primary size-8">history</span>
                                <h3 className="font-bold">Verification Log</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    View recent payment authorizations and biometric login attempts in Security Hub.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 max-w-[1024px] mx-auto">
                    <p>© 2024 SmartPay Biometrics. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
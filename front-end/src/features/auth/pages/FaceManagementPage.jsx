// FaceManagementPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import faceService from "../services/faceService";
import { showSuccess, showError, showConfirm } from "../../../utils/swalUtils";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

export default function FaceManagementPage() {
    const navigate = useNavigate();
    const { user: authUser } = useAuth(); // Lấy user từ context
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [embeddings, setEmbeddings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Sử dụng authUser.id nếu có, nếu không faceService sẽ gọi /api/me
                const data = await faceService.listEmbeddings(authUser?.id);
                console.log("🔍 [FaceManagement] Data fetched:", data);
                setEmbeddings(data || []);
            } catch (err) {
                console.error("❌ [FaceManagement] Load embeddings error:", err);
                const errorMsg = err.response?.data?.message || "Không tải được danh sách khuôn mặt";
                showError(errorMsg, "Lỗi");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [authUser]);

    const handleAddPose = (pose = null) => {
        navigate("/security/face/register", { state: { pose } }); 
    };

    const handleReRegisterAll = async () => {
        const result = await showConfirm("Xác nhận", "Bạn có chắc muốn xóa và đăng ký lại toàn bộ?");
        if (!result.isConfirmed) return;
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
        const result = await showConfirm("Xác nhận xóa", "Xóa pose này?");
        if (!result.isConfirmed) return;
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
        <div className="relative flex min-h-screen w-full flex-col bg-[#f6f8f7] dark:bg-slate-900 font-display text-[#111714] dark:text-white transition-colors duration-300">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeRoute="security" />

                <main className="flex-1 py-8 px-4 md:px-10 overflow-y-auto">
                    <div className="max-w-[1024px] mx-auto flex flex-col gap-6">
                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                            <div className="flex flex-col gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 w-fit">
                                    Biometric Security
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý khuôn mặt</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    Bảo mật thanh toán của bạn bằng dữ liệu nhận diện khuôn mặt đa góc độ.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleDarkMode}
                                    className="size-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-200/20 dark:shadow-none"
                                >
                                    <span className="material-symbols-outlined text-2xl transition-transform duration-500 group-hover:rotate-90">
                                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </button>
                                <button
                                    onClick={handleReRegisterAll}
                                    className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 px-6 text-sm font-black bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-200/20 dark:shadow-none"
                                >
                                    Làm mới tất cả
                                </button>
                                <button
                                    onClick={() => handleAddPose()}
                                    className="flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-black text-background-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined mr-2 text-xl font-black">add_a_photo</span>
                                    Thêm góc mặt
                                </button>
                            </div>
                        </div>

                        {/* Warning Missing Poses */}
                        {missingPoses.length > 0 && (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-orange-200 bg-orange-50/50 dark:bg-orange-900/10 dark:border-orange-900/20 p-6 backdrop-blur-sm">
                                <div className="flex gap-5">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shadow-inner">
                                        <span className="material-symbols-outlined text-2xl font-black">security_update_warning</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-lg font-black text-orange-900 dark:text-orange-100 uppercase tracking-tight">Thiếu dữ liệu bảo mật</p>
                                        <p className="text-sm text-orange-800/70 dark:text-orange-400/70 font-medium">
                                            Yêu cầu các góc mặt Trái, Trước và Phải để đạt độ bảo mật tối ưu.
                                            Cần bổ sung: <span className="font-black text-orange-600 dark:text-orange-400 uppercase">{missingPoses.join(", ")}</span>.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddPose()}
                                    className="flex min-w-[160px] h-11 items-center justify-center rounded-xl bg-orange-600 text-white text-sm font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                                >
                                    Hoàn tất ngay
                                </button>
                            </div>
                        )}

                        {/* Table Embeddings */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-sm font-semibold">Góc mặt</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Trạng thái</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Ngày đăng ký</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Thao tác</th>
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
                                                        Đã đăng ký
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
                                                        XÓA
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
                                                            Chưa đăng ký
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-slate-400">—</td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            onClick={() => handleAddPose(pose)}
                                                            className="text-primary hover:opacity-80 font-bold text-sm tracking-wide"
                                                        >
                                                            THÊM NGAY
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
                                <h3 className="font-bold">Lưu trữ an toàn</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Dữ liệu sinh trắc học của bạn được mã hóa và lưu trữ an toàn cục bộ trên thiết bị của bạn.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-primary size-8">analytics</span>
                                <h3 className="font-bold">Độ chính xác cao</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Việc nhận diện đa góc độ giúp giảm tỷ lệ từ chối sai và cải thiện tốc độ nhận dạng trong điều kiện ánh sáng yếu.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-primary size-8">history</span>
                                <h3 className="font-bold">Nhật ký xác minh</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Xem các ủy quyền thanh toán gần đây và các lần đăng nhập sinh trắc học tại Trung tâm Bảo mật.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 max-w-[1024px] mx-auto">
                    <p>© 2024 SmartPay Sinh trắc học. Đã đăng ký bản quyền.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Chính sách Bảo mật</a>
                        <a className="hover:text-primary transition-colors" href="#">Điều khoản Dịch vụ</a>
                        <a className="hover:text-primary transition-colors" href="#">Liên hệ Hỗ trợ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
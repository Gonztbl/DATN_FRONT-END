import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import userService from "../api/userService";
import faceService from "../../auth/services/faceService";
import { useNotification } from "../../../context/NotificationContext";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../auth/context/AuthContext";

export default function ProfilePage() {
  const { showSuccess, showError } = useNotification();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [biometricsLoading, setBiometricsLoading] = useState(true);
  const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    jobSegment: "",
  });

  // LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
        setAvatar(normalizeAvatar(data.avatarUrl || data.avatar));

        let fName = data.firstName || "";
        let lName = data.lastName || "";
        if (!fName && !lName && data.fullName) {
          const parts = data.fullName.split(" ");
          if (parts.length > 0) {
            lName = parts.pop();
            fName = parts.join(" ");
          }
        }

        setForm({
          firstName: fName,
          lastName: lName,
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
          address: data.address || "",
          jobSegment: data.jobSegment || "",
        });
      } catch (error) {
        console.error("Load profile failed", error);
        showError("Không thể tải thông tin hồ sơ", "Lỗi");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const checkBiometrics = async () => {
      setBiometricsLoading(true);
      try {
        // Kiểm tra embeddings từ API
        const embeddings = await faceService.listEmbeddings(authUser?.id);
        console.log("🔍 [ProfilePage] Biometrics data:", embeddings);
        console.log("🔍 [ProfilePage] authUser.id:", authUser?.id);
        console.log("🔍 [ProfilePage] embeddings.length:", embeddings?.length);

        // Chỉ true nếu là mảng VÀ có ít nhất 1 phần tử HỢP LỆ (có id/embeddingId và pose)
        const isRegistered =
          Array.isArray(embeddings) &&
          embeddings.length > 0 &&
          embeddings.some(e => e && (e.id !== undefined || e.embeddingId !== undefined) && e.pose);

        console.log("🔍 [ProfilePage] isRegistered:", isRegistered);
        setHasBiometrics(isRegistered);
      } catch (err) {
        console.error("❌ [ProfilePage] Không check được biometrics:", err);
        setHasBiometrics(false);
      } finally {
        setBiometricsLoading(false);
      }
    };
    checkBiometrics();
  }, [authUser, user]); // Chạy lại khi authUser hoặc user thay đổi

  // FORM HANDLERS
  const handleChange = (e) => {
    if (!isEditing) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => setIsEditing(true);

  const handleCancel = () => setIsEditing(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        jobSegment: form.jobSegment,
      });

      if (res?.status === "FAILED" || res?.status === "ERROR") {
        throw new Error(res.message || "Cập nhật thất bại");
      }

      setIsEditing(false);
      const newFullName = `${form.firstName} ${form.lastName}`.trim();
      setUser((prev) => ({ ...prev, fullName: newFullName, ...form }));
      showSuccess("Hồ sơ đã được cập nhật thành công", "Cập nhật thành công");
    } catch (error) {
      showError(error.message || "Cập nhật hồ sơ thất bại", "Lỗi");
    }
  };

  // AVATAR
  const handleAvatarChange = (e) => {
    if (!isEditing) return;
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Vui lòng chọn file ảnh hợp lệ", "File không hợp lệ");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      showError("Ảnh đại diện phải dưới 2MB", "File quá lớn");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setAvatar(base64);
      try {
        const res = await userService.updateAvatar(base64);
        if (res?.status === "FAILED" || res?.status === "ERROR") {
          throw new Error(res.message || "Cập nhật avatar thất bại");
        }
        showSuccess("Ảnh đại diện đã cập nhật", "Thành công");
      } catch (err) {
        showError(err.message || "Cập nhật avatar thất bại", "Lỗi");
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeRoute="profile" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Thông tin cá nhân</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center shrink-0"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className="material-symbols-outlined transition-all">
                  {isDarkMode ? "light_mode" : "dark_mode"}
                </span>
              </button>
            </div>

            {/* Profile Header Card */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-10">
                <div className="relative size-32 md:size-40 shrink-0 group">
                  <div
                    className="size-full rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${avatar || "/default-avatar.png"})` }}
                  />
                  {user.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-background-dark rounded-xl size-8 flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
                      <span className="material-symbols-outlined text-sm font-black">verified</span>
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 border-2 border-dashed border-primary/50">
                      <span className="material-symbols-outlined text-white text-3xl mb-1">add_a_photo</span>
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Thay đổi</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold">{user.fullName || user.userName}</h2>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    {user.verified && (
                      <span className="px-3 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Đã xác thực
                      </span>
                    )}
                    {user.membership && (
                      <span className="px-3 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                        {user.membership}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-slate-500 dark:text-slate-400">
                    Cập nhật ảnh đại diện và thông tin cá nhân tại đây.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={handleUpdateProfile}
                    className="px-6 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition"
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>
            </div>

            {/* Personal Info Form */}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Họ</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Tên</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Số điện thoại</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Địa chỉ</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Nghề nghiệp</label>
                  <select
                    name="jobSegment"
                    value={form.jobSegment}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  >
                    <option value="unknown">Chưa rõ / Khác (Unknown)</option>
                    <option value="employee">Người lao động (Employee)</option>
                    <option value="freelancer">Nghề tự do (Freelancer)</option>
                    <option value="student">Học sinh / Sinh viên (Student)</option>
                    <option value="retired">Đã nghỉ hưu (Retired)</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-primary font-bold text-background-dark hover:opacity-90 transition shadow-lg shadow-primary/20"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </form>

            {/* Biometric Authentication Section - Tích hợp face */}
            <div className="rounded-2xl border border-primary/10 dark:border-primary/5 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-slate-100 dark:bg-slate-800/50 min-h-[250px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent animate-pulse" />

                  {/* High-tech scanner effect placeholder */}
                  <div className="relative">
                    <span className={`material-symbols-outlined text-9xl transition-all duration-500 ${hasBiometrics ? "text-primary scale-110 drop-shadow-[0_0_20px_rgba(25,230,107,0.3)]" : "text-slate-300 dark:text-slate-700"}`}>
                      {hasBiometrics ? "face_check" : "face"}
                    </span>
                    {!biometricsLoading && !hasBiometrics && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-[nav-scan_2s_linear_infinite]" />
                    )}
                  </div>
                </div>

                <div className="flex-1 p-8 md:p-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      Smart Security
                    </div>
                    {biometricsLoading ? (
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold italic animate-pulse">
                        <span className="size-2 rounded-full bg-slate-400" />
                        Đang kiểm tra...
                      </div>
                    ) : hasBiometrics ? (
                      <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-wide">
                        <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        Đã kích hoạt
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-500 text-xs font-black uppercase tracking-wide">
                        <span className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        Chưa thiết lập
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Xác thực khuôn mặt</h3>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Bảo vệ ví tiền của bạn bằng công nghệ nhận dạng sinh trắc học tiên tiến.
                      Sử dụng khuôn mặt để xác minh các giao dịch chuyển tiền và rút tiền nhạy cảm.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Trạng thái bảo mật</p>
                      <p className={`text-lg font-black ${biometricsLoading ? "text-slate-400" : hasBiometrics ? "text-emerald-500" : "text-rose-500"}`}>
                        {biometricsLoading ? "Đang xác thực..." : hasBiometrics ? "Security Shield Active" : "Action Required"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/security/face')}
                      className="w-full sm:w-auto group/btn flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary font-black text-background-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                    >
                      <span className="material-symbols-outlined font-black group-hover:rotate-12 transition-transform">shield_person</span>
                      {hasBiometrics ? "Quản lý sinh trắc học" : "Thiết lập ngay"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function normalizeAvatar(base64) {
  if (!base64) return null;
  if (base64.startsWith("data:image")) return base64;
  return `data:image/png;base64,${base64}`;
}
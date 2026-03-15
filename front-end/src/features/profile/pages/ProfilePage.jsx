import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import userService from "../api/userService";
import faceService from "../../auth/services/faceService";
import { useNotification } from "../../../context/NotificationContext";

export default function ProfilePage() {
  const { showSuccess, showError } = useNotification();
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
        // faceService đã tự động lấy userId từ /api/me nếu ta không truyền gì
        const embeddings = await faceService.listEmbeddings();
        console.log("Embeddings raw từ API:", embeddings);

        // Chỉ true nếu là mảng VÀ có ít nhất 1 phần tử HỢP LỆ (có id và pose)
        const isRegistered =
          Array.isArray(embeddings) &&
          embeddings.length > 0 &&
          embeddings.some(e => e && e.id && e.pose);

        setHasBiometrics(isRegistered);
      } catch (err) {
        console.error("Không check được biometrics", err);
        setHasBiometrics(false);
      } finally {
        setBiometricsLoading(false);
      }
    };
    checkBiometrics();
  }, []);

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
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeRoute="profile" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-background-light dark:bg-background-dark">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight">Personal Information</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
              </p>
            </div>

            {/* Profile Header Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-8">
                <div className="relative size-24 md:size-32 shrink-0">
                  <div
                    className="size-full rounded-full bg-cover border-4 border-primary"
                    style={{ backgroundImage: `url(${avatar || "/default-avatar.png"})` }}
                  />
                  {user.verified && (
                    <span className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full size-6 flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition">
                      <span className="text-white text-sm font-medium">Chỉnh sửa</span>
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
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-slate-100 dark:bg-slate-800 min-h-[200px] flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary via-transparent to-transparent" />
                  <span className="material-symbols-outlined text-8xl text-primary/40 group-hover:scale-110 transition-transform duration-300">
                    face
                  </span>
                </div>
                <div className="flex-1 p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Khuyến nghị bảo mật</span>
                    {biometricsLoading ? (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Đang kiểm tra...
                      </span>
                    ) : hasBiometrics ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <span className="mr-1.5 size-2 rounded-full bg-green-600 animate-pulse" />
                        Đã đăng ký
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <span className="mr-1.5 size-2 rounded-full bg-red-600" />
                        Cần hành động
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">Xác thực khuôn mặt</h3>
                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                      Thêm lớp bảo mật bổ sung bằng cách sử dụng khuôn mặt để xác thực giao dịch và đăng nhập nhanh chóng, an toàn.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-slate-500 dark:text-slate-400">Trạng thái hiện tại:</p>
                      <p className={`font-bold ${biometricsLoading ? "text-slate-400" : hasBiometrics ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {biometricsLoading ? "Đang tải..." : hasBiometrics ? "Đã đăng ký" : "Chưa đăng ký"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/security/face')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary font-bold text-background-dark hover:opacity-90 transition shadow-lg shadow-primary/20"
                    >
                      <span className="material-symbols-outlined">add_reaction</span>
                      Quản lý xác thực khuôn mặt
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
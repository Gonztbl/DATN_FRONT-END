import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import HeaderAdmin from '../../../components/layout/HeaderAdmin';
import { showSuccess, showError, showConfirm } from '../../../utils/swalUtils';
import userService from '../../profile/api/userService';
import faceService from "../../auth/services/faceService";
import walletService from "../../wallet/api/walletService";
import transactionService from "../../wallet/api/transactionService";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(location.state?.user || null);
  const [embeddings, setEmbeddings] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(!location.state?.user);
  const [activeTab, setActiveTab] = useState("general");

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    isActive: true
  });

  useEffect(() => {
    const fetchData = async () => {
      // Nếu đã có user từ state, chỉ cần fetch embeddings, wallets, txns
      if (user) {
        setLoading(true);
        try {
          const embData = await faceService.listEmbeddings(id);
          setEmbeddings(embData || []);

          // Fetch wallets & transactions cho user này
          const allWallets = await walletService.getAllWallets(0, 1000);
          const walletList = Array.isArray(allWallets) ? allWallets : (allWallets.content || []);
          setWallets(walletList.filter(w => String(w.userId) === String(id)));

          const allTxns = await transactionService.getAllAdminTransactions();
          const txnList = Array.isArray(allTxns) ? allTxns : [];
          setTransactions(txnList.filter(t => String(t.userId) === String(id)));

        } catch (err) {
          console.error("Load related data error:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Nếu không có user (load trực tiếp URL), fetch info và tất cả mọi thứ
      setLoading(true);
      try {
        // 1. Lấy thông tin user (đã cấu hình list fetch trong service)
        const foundUser = await userService.getUserById(id);
        setUser(foundUser);

        // 3. Lấy related data
        const embData = await faceService.listEmbeddings(id);
        setEmbeddings(embData || []);

        const allWallets = await walletService.getAllWallets(0, 1000);
        const walletList = Array.isArray(allWallets) ? allWallets : (allWallets.content || []);
        setWallets(walletList.filter(w => String(w.userId) === String(id)));

        const allTxns = await transactionService.getAllAdminTransactions();
        const txnList = Array.isArray(allTxns) ? allTxns : [];
        setTransactions(txnList.filter(t => String(t.userId) === String(id)));

      } catch (err) {
        console.error("Load user data error:", err);
        showError("Lỗi", err.message || "Không tải được thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, user]);

  const handleDeleteEmbedding = async (embeddingId) => {
    const result = await showConfirm("Xác nhận xóa", "Xác nhận xóa embedding này?");
    if (!result.isConfirmed) return;
    try {
      await faceService.deleteEmbedding(embeddingId);
      showSuccess("Thành công", "Đã xóa embedding");
      setEmbeddings(embeddings.filter((e) => e.id !== embeddingId));
    } catch (err) {
      showError("Lỗi", err.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleResetAll = async () => {
    const result = await showConfirm("Xác nhận xóa", "Xóa toàn bộ embeddings của user này?");
    if (!result.isConfirmed) return;

    try {
      for (const emb of embeddings) {
        await faceService.deleteEmbedding(emb.id);
      }
      showSuccess("Thành công", "Đã reset toàn bộ biometrics");
      setEmbeddings([]);
    } catch (err) {
      showError("Lỗi", "Reset thất bại");
    }
  };

  const handleTestVerification = () => {
    navigate(`/admin/users/${id}/verify-face`, { state: { userId: id } });
  };

  const handleAddEmbedding = (pose = null) => {
    navigate(`/admin/users/${id}/register-face`, { 
      state: { userId: id, pose } 
    });
  };

  // --- Chức năng Edit Profile ---
  const handleOpenEditModal = () => {
    if (user) {
      setEditFormData({
        id: id, // Thêm ID vào body
        userName: user.userName || "",
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        isActive: user.active ?? user.isActive ?? true
      });
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Jackson mapping converts boolean isActive to "active" in JSON payload
    const payload = {
      ...editFormData,
      active: editFormData.isActive
    };
    delete payload.isActive; // Loại bỏ biến thừa

    console.log("Saving profile for user:", id, "with data:", payload);
    setIsSaving(true);
    try {
      const updatedUser = await userManageService.updateUser(id, payload);
      console.log("Update successful, backend returned:", updatedUser);
      setUser(updatedUser); 
      showSuccess("Đã cập nhật thông tin người dùng", "Thành công");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
      showError(err.response?.data?.message || err.message || "Cập nhật thất bại", "Lỗi");
    } finally {
      setIsSaving(false);
    }
  };
  // -----------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <SidebarAdmin />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy người dùng</h2>
          <button onClick={() => navigate("/user-manager")} className="text-primary font-bold hover:underline">
            Quay lại danh sách
          </button>
        </main>
      </div>
    );
  }

  const lastVerifiedDate = embeddings.length > 0 
    ? new Date(Math.max(...embeddings.map(e => new Date(e.createdAt))))
    : null;

  const isUserActive = user.active ?? user.isActive;

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <SidebarAdmin />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto w-full">
        <HeaderAdmin title="User Management" />
        
        <div className="p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-display">
              <Link to="/user-manager" className="hover:text-primary transition-colors">Users</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-900 dark:text-slate-200 font-medium">
                User Details - {user.fullName || user.userName}
              </span>
            </nav>

        {/* Main User Detail Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden font-display">
          {/* Header Section */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined !text-4xl text-primary">account_circle</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.fullName || user.userName}</h2>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    ID: SP-{user.id} <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className={`${isUserActive ? "text-emerald-600" : "text-red-500"} font-medium`}>
                      {isUserActive ? "Active" : "Locked"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleOpenEditModal}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-8 mt-8 -mb-6 overflow-x-auto no-scrollbar">
              {["general", "wallets", "biometrics", "activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab 
                      ? "text-primary border-primary" 
                      : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab === "general" ? "General Info" : 
                   tab === "wallets" ? "Wallets" : 
                   tab === "biometrics" ? "Biometrics" : "Activity Logs"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content: Biometrics */}
          {activeTab === "biometrics" && (
            <div className="p-6 animate-in fade-in duration-300">
              {/* Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 mb-8 border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <span className="material-symbols-outlined !text-2xl">face</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">Biometric Face Authentication</h3>
                      <p className="text-slate-500 text-sm">
                        Last verified: {lastVerifiedDate ? lastVerifiedDate.toLocaleString("vi-VN") : "Never"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <button 
                      onClick={() => handleAddEmbedding()}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span> Add New Embedding
                    </button>
                    <button 
                      onClick={handleTestVerification}
                      disabled={embeddings.length === 0}
                      title={embeddings.length === 0 ? "User has no face embeddings to test" : "Test biometric verification"}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                        embeddings.length === 0 
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-200" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <span className="material-symbols-outlined">verified</span> Test Verification
                    </button>
                    <button 
                      onClick={handleResetAll}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete_sweep</span> Reset All
                    </button>
                  </div>
                </div>
              </div>

              {/* Embeddings Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Stored Embeddings ({embeddings.length})</h4>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Face Recognition V2.4</span>
                </div>
                
                {embeddings.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-6 py-4">Embedding ID</th>
                          <th className="px-6 py-4">Pose</th>
                          <th className="px-6 py-4">Created At</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {embeddings.map((emb) => (
                          <tr key={emb.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-6 py-4 font-medium font-mono text-xs">#{emb.id}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">
                                  {emb.pose === "front" ? "person" : emb.pose === "left" ? "turn_right" : "turn_left"}
                                </span>
                                <span className="capitalize">{emb.pose}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {new Date(emb.createdAt).toLocaleString("vi-VN", {
                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteEmbedding(emb.id)}
                                className="text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                    <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <span className="material-symbols-outlined !text-3xl">no_photography</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">No Biometric Data Found</h3>
                    <p className="text-slate-500 text-sm mb-6">This user hasn't set up face authentication yet.</p>
                    <button 
                      onClick={() => handleAddEmbedding()}
                      className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
                    >
                      Initialize Setup
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content: General Info */}
          {activeTab === "general" && (
            <div className="p-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">badge</span>
                    Account Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Username</span>
                      <p className="font-semibold">{user.userName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Email</span>
                      <p className="font-semibold">{user.email || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Phone Number</span>
                      <p className="font-semibold">{user.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Role</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {user.roles?.[0]?.name || "USER"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    System Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Account Created</span>
                      <p className="font-semibold">
                        {user.createdAt ? new Date(user.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "medium", timeStyle: "short"
                        }) : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Account Status</span>
                      <p className={`font-semibold ${isUserActive ? "text-emerald-600" : "text-red-500"}`}>
                        {isUserActive ? "Active" : "Locked"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Number of Wallets</span>
                      <p className="font-semibold">{wallets.length} wallet(s)</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block mb-1">Total Transactions</span>
                      <p className="font-semibold">{transactions.length} transaction(s)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Wallets */}
          {activeTab === "wallets" && (
            <div className="p-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">User Wallets ({wallets.length})</h4>
                <button 
                  onClick={() => navigate("/admin/wallets")}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Manage in Wallet Center
                </button>
              </div>

              {wallets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {wallets.map(wallet => (
                    <div key={wallet.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-3 items-center">
                          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                          </div>
                          <div>
                            <p className="font-mono text-lg font-bold tracking-tight">{wallet.accountNumber}</p>
                            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Wallet ID: {wallet.id}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${wallet.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {wallet.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-6">
                        <p className="text-sm text-slate-500 font-medium">Available Balance</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wallet.availableBalance || 0)}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={() => navigate("/admin/wallets", { state: { searchId: wallet.accountNumber } })}
                          className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => navigate("/admin/wallets", { state: { topupWalletUserId: wallet.userId } })}
                          className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                        >
                          Topup
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <span className="material-symbols-outlined !text-3xl">account_balance_wallet</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">No Wallets Found</h3>
                  <p className="text-slate-500 text-sm mb-6">This user does not have any active wallets.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Activity Logs (Transactions) */}
          {activeTab === "activity" && (
            <div className="p-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Recent Transactions ({transactions.length})</h4>
                <button 
                  onClick={() => navigate("/admin/transactions", { state: { searchUserId: id } })}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  View All in History
                </button>
              </div>

              {transactions.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">Txn ID</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {transactions.slice(0, 10).map((txn) => ( // Show only top 10 recent
                        <tr key={txn.transactionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-medium font-mono text-xs">{txn.transactionId}</td>
                          <td className="px-6 py-4 font-semibold">{txn.type}</td>
                          <td className={`px-6 py-4 font-extrabold text-right ${txn.direction === 'OUT' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {txn.direction === 'OUT' ? '-' : '+'}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(txn.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 
                              txn.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(txn.createdAt).toLocaleString("vi-VN", {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transactions.length > 10 && (
                    <div className="p-4 text-center bg-slate-50 dark:bg-slate-800/30">
                      <p className="text-sm text-slate-500 italic">Showing 10 most recent transactions.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <span className="material-symbols-outlined !text-3xl">receipt_long</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">No Transactions Found</h3>
                  <p className="text-slate-500 text-sm mb-6">This user has not made any transactions yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal Content */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">
                Edit User Profile
              </h3>
              <button 
                onClick={handleCloseEditModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors size-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={editFormData.userName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="e.g. john_doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="123-456-7890"
                />
              </div>
              
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  name="isActive"
                  checked={editFormData.isActive}
                  onChange={handleFormChange}
                  className="size-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Account is Active
                </span>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${editFormData.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                  {editFormData.isActive ? 'ON' : 'LOCKED'}
                </span>
              </label>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 py-2.5 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <><span className="material-symbols-outlined animate-spin !text-sm">refresh</span> Saving...</>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
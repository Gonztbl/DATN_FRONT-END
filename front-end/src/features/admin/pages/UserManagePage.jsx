import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userManageService from "../api/userManageService";
import SidebarAdmin from "../../../components/layout/SidebarAdmin";
import HeaderAdmin from "../../../components/layout/HeaderAdmin";
import { useAuth } from "../../auth/context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";

export default function UserManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showError } = useNotification();


  const PAGE_SIZE = 10;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const fetchUsers = async () => {
    try {
      const data = await userManageService.getAllUsers();
      setUsers(data);
    } catch {
      console.error("Không lấy được danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const keyword = searchText.toLowerCase();

    const matchText =
      user.userName?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.fullName?.toLowerCase().includes(keyword) ||
      user.phone?.toString().includes(keyword);

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.active) ||
      (statusFilter === "LOCKED" && !user.active);

    const matchRole =
      roleFilter === "ALL" ||
      user.role === roleFilter || 
      user.roles?.some(r => r.name === roleFilter);

    return matchText && matchStatus && matchRole;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleResetFilter = () => {
    setSearchText("");
    setStatusFilter("ALL");
    setRoleFilter("ALL");
    setCurrentPage(1);
  };

  const handleToggleLock = async (user) => {
    const newActiveStatus = !user.active;

    try {
      user.active
        ? await userManageService.lockUser(user.id)
        : await userManageService.unlockUser(user.id);

      // Update local state instead of refetching all users
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id
            ? { ...u, active: newActiveStatus }
            : u
        )
      );
    } catch (error) {
      showError(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái người dùng", "Lỗi");
    }
  };

  return (
    <div className="bg-white text-slate-900 h-screen flex font-display">
      <SidebarAdmin />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-background-dark h-screen overflow-y-auto w-full">
        <HeaderAdmin title="User Management" />

        <div className="p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

            {/* FILTER */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
                {/* SEARCH */}
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Search by Text
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      search
                    </span>

                    <input
                      className="w-full bg-white border border-gray-300 rounded-xl h-12
                 pl-11 pr-4 focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Search by username, email, fullname or phone number"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* STATUS - SIMPLE WORKING SOLUTION */}
                <div className="space-y-1.5 w-full sm:w-48">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Search by Status
                  </label>

                  <div className="relative">
                    {/* Filter icon */}
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      filter_alt
                    </span>

                    {/* Dùng browser default arrow - KHÔNG có appearance-none */}
                    <select
                      className="w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary h-10 pl-10"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="ALL">All</option>
                      <option value="ACTIVE">Active</option>
                      <option value="LOCKED">Locked</option>
                    </select>

                    {/* KHÔNG có arrow element nào cả */}
                  </div>
                </div>

                {/* ROLE FILTER */}
                <div className="space-y-1.5 w-full sm:w-48">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Filter by Role
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      badge
                    </span>
                    <select
                      className="w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary h-10 pl-10"
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="ALL">All Roles</option>
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPPORT">Support</option>
                      <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                      <option value="SHIPPER">Shipper</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESET */}
              <button
                onClick={handleResetFilter}
                className="text-sm text-gray-500 hover:text-black flex items-center gap-1 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">
                  restart_alt
                </span>
                Reset
              </button>

              <div className="h-8 w-[1px] bg-gray-200 hidden lg:block mx-2"></div>

              <button
                onClick={() => navigate("/admin/users/create")}
                className="bg-primary text-black text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Create User
              </button>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-xs uppercase text-gray-500">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Fullname</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Role</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : pagedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    pagedUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/admin/users/${user.id}`, { state: { user } })}
                      >
                        <td className="px-6 py-4 font-mono">#{user.id}</td>
                        <td className="px-6 py-4 font-semibold">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4">{user.fullName || "—"}</td>
                        <td className="px-6 py-4">{user.phone || "—"}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-[200px]" title={user.email}>{user.email}</td>
                        <td className="px-6 py-4 text-center">
                          {(() => {
                            const roleName = user.role || user.roles?.[0]?.name || "USER";
                            let icon = "person";
                            let colorClass = "text-gray-400 bg-gray-100";
                            
                            if (roleName === 'ADMIN') {
                              icon = "shield_person";
                              colorClass = "text-purple-600 bg-purple-100";
                            } else if (roleName === 'SHIPPER') {
                              icon = "local_shipping";
                              colorClass = "text-blue-600 bg-blue-100";
                            } else if (roleName === 'RESTAURANT_OWNER') {
                              icon = "restaurant";
                              colorClass = "text-orange-600 bg-orange-100";
                            } else if (roleName === 'SUPPORT') {
                              icon = "support_agent";
                              colorClass = "text-emerald-600 bg-emerald-100";
                            }

                            return (
                              <div className={`inline-flex items-center justify-center p-1.5 rounded-lg ${colorClass}`} title={roleName}>
                                <span className="material-symbols-outlined !text-xl">{icon}</span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                            : "--"}
                        </td>
                        <td className="px-6 py-4">
                          {user.active ? (
                            <span className="text-green-600 font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold">
                              Locked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleLock(user)}
                            className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none"
                            style={{
                              backgroundColor: user.active ? '#22c55e' : '#ef4444'
                            }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${user.active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="border-t px-4 py-3 flex justify-between items-center bg-gray-50">
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}–{Math.min(endIndex, totalUsers)} of{" "}
                  {totalUsers}
                </span>

                <div className="flex items-center gap-2">
                  {/* PREVIOUS */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`size-8 flex items-center justify-center rounded-lg border text-sm
        ${currentPage === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>

                  {/* PAGE NUMBERS */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`size-8 rounded-lg text-sm font-semibold transition-colors
            ${p === currentPage
                            ? "bg-primary text-black"
                            : "border border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* NEXT */}
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`size-8 flex items-center justify-center rounded-lg border text-sm
        ${currentPage === totalPages || totalPages === 0
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

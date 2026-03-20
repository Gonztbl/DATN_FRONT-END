import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SpendingSummaryPage from "../features/wallet/pages/SpendingSummaryPage";
import DashboardPage from "../features/wallet/pages/DashboardPage";
import DepositPage from "../features/wallet/pages/DepositPage";
import Withdraw from "../features/wallet/pages/Withdraw";
import ReceiveMoneyPage from "../features/wallet/pages/ReceiveMoneyPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import TransferHistoryPage from "../features/wallet/pages/TransferHistoryPage";
import AdminTransactionHistoryPage from "../features/admin/pages/AdminTransactionHistoryPage";
import AdminWalletPage from "../features/admin/pages/AdminWalletPage";
import FaceManagementPage from "../features/auth/pages/FaceManagementPage";
import FaceRegisterPage from "../features/auth/pages/FaceRegisterPage";

import UserManagement from "../features/admin/pages/UserManagePage";
import LandingPage from "../features/public/pages/LandingPage";
import FoodAndDrinkPage from "../features/shopping/pages/FoodAndDrinkPage";
import HistoryOrderByUser from "../features/shopping/pages/historyorderbyuser";
import ViewOrder from "../features/shopping/pages/vieworder";
import VendorManagerPage from "../features/admin/pages/VendorManagerPage";
import AdminRestaurantPage from "../features/admin/pages/AdminRestaurantPage";
import AdminProductPage from "../features/admin/pages/AdminProductPage";
import UserDetailPage from "../features/admin/pages/UserDetailPage";
import AdminVerifyFacePage from "../features/admin/pages/AdminVerifyFacePage";
import AdminFaceRegisterPage from "../features/admin/pages/AdminFaceRegisterPage";
import AdminUserCreatePage from "../features/admin/pages/AdminUserCreatePage";
import OrderListShipperPage from "../features/shipper/pages/OrderListShipperPage";
import OrderDetailShipperPage from "../features/shipper/pages/OrderDetailShipperPage";
import ListOrderAdmin from "../features/admin/pages/ListOrderAdmin";
import ViewOrderByAdmin from "../features/admin/pages/ViewOrderByAdmin";
import ProfileShipperPage from "../features/shipper/pages/ProfileShipperPage";
import ShipperDashboardPage from "../features/shipper/pages/ShipperDashboardPage";
import MerchantDashboardPage from "../features/restaurant/pages/MerchantDashboardPage";
import MerchantOrderPage from "../features/restaurant/pages/MerchantOrderPage";
import MerchantOrderDetailPage from "../features/restaurant/pages/MerchantOrderDetailPage";
import MerchantMenuPage from "../features/restaurant/pages/MerchantMenuPage";
import MerchantSettingsPage from "../features/restaurant/pages/MerchantSettingsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <DepositPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spending-summary"
        element={
          <ProtectedRoute>
            <SpendingSummaryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receive-money"
        element={
          <ProtectedRoute>
            <ReceiveMoneyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer-history"
        element={
          <ProtectedRoute>
            <TransferHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTransactionHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-manager"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUserCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id/verify-face"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminVerifyFacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id/register-face"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminFaceRegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/wallets"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminWalletPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopping/food-drink"
        element={
          <ProtectedRoute>
            <FoodAndDrinkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopping/order-history"
        element={
          <ProtectedRoute>
            <HistoryOrderByUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopping/view-order/:id"
        element={
          <ProtectedRoute>
            <ViewOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vendor-manager"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <VendorManagerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ListOrderAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ViewOrderByAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/restaurant-manager"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRestaurantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product-manager"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security/face"
        element={
          <ProtectedRoute>
            <FaceManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security/face-management"
        element={
          <ProtectedRoute>
            <FaceManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security/face/register"
        element={
          <ProtectedRoute>
            <FaceRegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipper/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SHIPPER', 'ADMIN']}>
            <ShipperDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipper/orders"
        element={
          <ProtectedRoute allowedRoles={['SHIPPER', 'ADMIN']}>
            <OrderListShipperPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipper/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['SHIPPER', 'ADMIN']}>
            <OrderDetailShipperPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipper/profile"
        element={
          <ProtectedRoute allowedRoles={['SHIPPER', 'ADMIN']}>
            <ProfileShipperPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
            <MerchantDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/orders"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
            <MerchantOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
            <MerchantOrderDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/menu"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
            <MerchantMenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/settings"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
            <MerchantSettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;

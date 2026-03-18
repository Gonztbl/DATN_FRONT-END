# Project UI Documentation

This document describes the purpose and functionality of each `.jsx` file (UI components) in the project.

## 1. Authentication (`features/auth`)

- **LoginPage.jsx**: Màn hình đăng nhập người dùng, hỗ trợ đăng nhập bằng tài khoản và mật khẩu.
- **RegisterPage.jsx**: Màn hình đăng ký tài khoản mới cho người dùng.
- **FaceAuthenticationPage.jsx**: Màn hình xác thực khuôn mặt, cho phép người dùng đăng ký các tư thế khuôn mặt (trực diện, trái, phải) và kiểm tra xác thực.
- **FaceManagementPage.jsx**: Quản lý các tư thế khuôn mặt đã đăng ký, cho phép thêm mới hoặc xóa các tư thế.
- **FaceRegisterPage.jsx**: Quy trình (wizard) hướng dẫn người dùng chụp và đăng ký các tư thế khuôn mặt.

## 2. Administration (`features/admin`)

- **AdminFaceRegisterPage.jsx**: Trang dành cho admin để đăng ký khuôn mặt cho một người dùng cụ thể.
- **AdminProductPage.jsx**: Quản lý danh sách sản phẩm (thêm, sửa, xóa, lọc theo danh mục/nhà hàng).
- **AdminRestaurantPage.jsx**: Quản lý danh sách các nhà hàng, bao gồm cập nhật trạng thái và xuất dữ liệu.
- **AdminTransactionHistoryPage.jsx**: Theo dõi và lọc lịch sử tất cả các giao dịch trong hệ thống.
- **AdminVerifyFacePage.jsx**: Trang kiểm tra xác thực khuôn mặt của người dùng dựa trên ID.
- **AdminWalletPage.jsx**: Quản lý ví của người dùng, xem số dư, nạp tiền và khóa/mở khóa tài khoản ví.
- **UserDetailPage.jsx**: Xem thông tin chi tiết một người dùng (hồ sơ, ví, dữ liệu sinh trắc học, lịch sử hoạt động).
- **UserManagePage.jsx**: Danh sách quản lý tất cả người dùng trong hệ thống.
- **AdminUserCreatePage.jsx**: Trang tạo tài khoản mới dành cho admin, hỗ trợ gán vai trò (Role) cho người dùng mới.
- **VendorManagerPage.jsx**: Quản lý các danh mục sản phẩm (Category) của các nhà bán hàng.

## 3. Wallet & Finance (`features/wallet`)

- **DashboardPage.jsx**: Trang tổng quan ví người dùng, hiển thị số dư, giao dịch gần đây và các tiện ích nhanh.
- **DepositPage.jsx**: Trang nạp tiền vào ví từ các thẻ đã liên kết.
- **ReceiveMoneyPage.jsx**: Hiển thị mã QR và thông tin tài khoản để nhận tiền.
- **SpendingSummaryPage.jsx**: Biểu đồ và tóm tắt chi tiêu hàng tháng của người dùng.
- **TransferHistoryPage.jsx**: Lịch sử chi tiết các giao dịch chuyển tiền và nạp tiền.
- **Withdraw.jsx**: Trang rút tiền từ ví về tài khoản ngân hàng liên kết.

## 4. User Profile (`features/profile`)

- **ProfilePage.jsx**: Quản lý thông tin cá nhân, cập nhật ảnh đại diện và trạng thái xác thực khuôn mặt.

## 5. Shopping (`features/shopping`)

- **FoodAndDrinkPage.jsx**: Giao diện đặt đồ ăn và thức uống, cho phép duyệt sản phẩm theo danh mục và thanh toán qua ví.

## 6. Public Pages (`features/public`)

- **LandingPage.jsx**: Trang giới thiệu dịch vụ (SmartPay), tích hợp chatbot tư vấn khách hàng.

## 7. Shipper (`features/shipper`)

- **ShipperDashboardPage.jsx**: Trang tổng quan dành cho shipper, hiển thị thống kê thu nhập, số đơn hàng và lịch sử hoạt động.
- **OrderListShipperPage.jsx**: Danh sách đơn hàng dành cho shipper (Chờ nhận, Đang giao, Đã giao, Thất bại).
- **OrderDetailShipperPage.jsx**: Chi tiết đơn hàng cho shipper, bao gồm thông tin khách hàng, nhà hàng, món ăn và cập nhật trạng thái giao hàng.
- **ProfileShipperPage.jsx**: Trang quản lý hồ sơ và trạng thái hoạt động của tài xế shipper.

## 8. Restaurant (Merchant - Chủ cửa hàng)

- **MerchantDashboardPage.jsx**: Trang tổng quan kinh doanh, hiển thị doanh thu, đơn hàng mới và hiệu suất nhân viên.
- **MerchantOrderPage.jsx**: Quản lý danh sách đơn hàng của nhà hàng với các tab trạng thái (Chờ, Xác nhận, Sẵn sàng, v.v.).
- **MerchantOrderDetailPage.jsx**: Xem chi tiết từng món ăn trong đơn, thông tin khách hàng và lịch trình đơn hàng.
- **MerchantMenuPage.jsx**: Quản lý thực đơn (thêm/sửa/xóa món), theo dõi doanh số từng món và trạng thái còn hàng.
- **MerchantSettingsPage.jsx**: Cấu hình thông tin nhà hàng, giờ mở cửa và phí giao hàng.

## 9. Layout Components (`components/layout`)

- **Header.jsx**: Thanh tiêu đề phía trên dành cho giao diện người dùng thường.
- **HeaderAdmin.jsx**: Thanh tiêu đề phía trên dành cho giao diện quản trị viên.
- **HeaderShipper.jsx**: Thanh tiêu đề phía trên dành cho giao diện shipper (bao gồm nút đăng xuất).
- **Sidebar.jsx**: Thanh menu bên trái cho người dùng thường (chuyển hướng giữa ví, giao dịch, hồ sơ, mua sắm).
- **SidebarAdmin.jsx**: Thanh menu bên trái cho quản trị viên (chuyển hướng giữa quản lý người dùng, ví, sản phẩm, nhà hàng).

## 8. Core Application (`app`)

- **App.jsx**: Thành phần gốc của ứng dụng, thiết lập context thông báo và định tuyến.
- **routes.jsx**: Định nghĩa tất cả các tuyến đường (routes) và phân quyền truy cập (Admin/User) cho các trang.

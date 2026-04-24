# Tài liệu Use Case: LoginPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng nhập (Login)
- **File**: `LoginPage.jsx`
- **Role**: Guest / User
- **Mô tả**: Giao diện cho phép người dùng đăng nhập vào hệ thống SmartPay bằng tài khoản đã đăng ký.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-LP-01: Nhập liệu thông tin đăng nhập
- Người dùng nhập Username và Password vào các trường tương ứng.
- Hỗ trợ tính năng hiển thị mật khẩu (Show/Hide password).
- Có link "Quên mật khẩu?" dẫn đến trang khôi phục (đang phát triển).

### UC-LP-02: Xác thực và Điều hướng (Role-based Routing)
- Hệ thống kiểm tra thông tin đăng nhập với server.
- Sau khi thành công, điều hướng dựa trên vai trò:
    - ADMIN → `/admin/transactions`
    - SHIPPER → `/shipper/orders`
    - RESTAURANT_OWNER → `/merchant/dashboard`
    - CUSTOMER/USER → `/dashboard`

### UC-LP-03: Kiểm tra trạng thái tài khoản
- Ngăn chặn đăng nhập nếu tài khoản đang ở trạng thái `INACTIVE` hoặc `active === false`.
- Hiển thị thông báo: "Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên."

### UC-LP-04: Đăng nhập mạng xã hội
- Hỗ trợ các nút đăng nhập nhanh qua Google và Apple.

### UC-LP-05: Carousel giới thiệu
- Hiển thị Carousel giới thiệu các tính năng (Xác thực, Quản lý, Bảo vệ) ở phía bên phải màn hình (Desktop mode).

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-LP-01: Bảo mật
- Mật khẩu được mã hóa khi gửi qua mạng.
- Sử dụng JWT Token để duy trì phiên làm việc.

### NFR-LP-02: UX/UI
- Giao diện hiện đại với phong cách Glassmorphism và hiệu ứng ánh sáng.
- Thông báo lỗi rõ ràng bên dưới tiêu đề khi sai thông tin hoặc tài khoản chưa kích hoạt.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng nhập (User Login)
1. **Tên Use Case**: Xác thực người dùng.
2. **Mô tả vắn tắt**: Người dùng đăng nhập để truy cập các tính năng của hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng nhập Username và Password.
        2) Hệ thống kiểm tra thông tin đăng nhập trên server. [A1]
        3) Nếu đúng, hệ thống lấy thông tin User và kiểm tra trạng thái hoạt động. [A2]
        4) Nếu tài khoản active, hệ thống lưu JWT Token và thông tin User vào context.
        5) Hệ thống điều hướng người dùng về trang Dashboard tương ứng với vai trò.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Sai thông tin**: Hệ thống hiển thị thông báo lỗi (ví dụ: "Đăng nhập thất bại").
        2) **[A2] Tài khoản chưa kích hoạt**: Hệ thống hiển thị thông báo "Tài khoản của bạn chưa được kích hoạt...".
4. **Tiền điều kiện**: Đã có tài khoản.
5. **Hậu điều kiện**: Người dùng truy cập thành công vào hệ thống.

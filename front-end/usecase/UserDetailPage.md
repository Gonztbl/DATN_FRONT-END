# Tài liệu Use Case: UserDetailPage

## 1. Thông tin chung
- **Tên màn hình**: Chi tiết Hồ sơ Người dùng (Admin)
- **File**: `UserDetailPage.jsx`
- **Role**: Admin
- **Mô tả**: Cung cấp cái nhìn 360 độ về một người dùng, bao gồm thông tin cá nhân, dữ liệu sinh trắc học, tài chính (ví) và lịch sử hoạt động.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-UDP-01: Hiển thị thông tin hồ sơ chi tiết
- Hiển thị đầy đủ thông tin: ID hệ thống, Username, Họ tên, Email, Số điện thoại, Vai trò, Ngày tạo tài khoản và Trạng thái hiện tại.

### UC-UDP-02: Chỉnh sửa thông tin người dùng
- Cung cấp Modal chỉnh sửa cho phép Admin cập nhật lại Username, Họ tên, Email, SĐT và thay đổi trạng thái hoạt động của người dùng.

### UC-UDP-03: Quản lý Sinh trắc học (Biometrics)
- Liệt kê danh sách các mẫu khuôn mặt (embeddings) đã đăng ký.
- Cho phép xóa từng mẫu ảnh hoặc xóa tất cả (Reset) dữ liệu khuôn mặt của user.
- Tắt/Mở nhanh tính năng xác thực khuôn mặt từ trang này.

### UC-UDP-04: Quản lý Ví và Số dư
- Hiển thị các thẻ Ví liên kết với người dùng.
- Cho phép xem số dư khả dụng và thực hiện nạp tiền nhanh thông qua điều hướng đến trung tâm quản lý ví.

### UC-UDP-05: Truy soát lịch sử giao dịch
- Hiển thị danh sách 10 giao dịch gần nhất của người dùng này (Loại giao dịch, Số tiền, Trạng thái, Thời gian).

### UC-UDP-06: Xóa người dùng
- Cho phép xóa hoàn toàn người dùng khỏi hệ thống (trừ vai trò ADMIN).
- Yêu cầu xác nhận qua hộp thoại Confirm trước khi thực hiện hành động xóa.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý chi tiết người dùng (Admin)
1. **Tên Use Case**: Truy soát và cập nhận thông tin User.
2. **Mô tả vắn tắt**: Admin xem toàn bộ thông tin của một người dùng cụ thể và thực hiện các điều chỉnh cần thiết.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin chọn một người dùng từ danh sách quản lý.
        2) Hệ thống hiển thị trang Chi tiết với các Tab chức năng.
        3) Admin chuyển đổi giữa các Tab để xem: Thông tin chung, Ví, Sinh trắc học, Lịch sử.
        4) Admin nhấn "Edit" để mở form chỉnh sửa thông tin.
        5) Admin nhấn "Delete" để xóa tài khoản (sau khi xác nhận). [A1]
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Xóa tài khoản Admin**: Nếu tài khoản mục tiêu là Admin, nút xóa sẽ bị ẩn hoặc vô hiệu hóa để bảo vệ hệ thống.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Thông tin người dùng được cập nhật hoặc tài khoản bị xóa khỏi hệ thống.

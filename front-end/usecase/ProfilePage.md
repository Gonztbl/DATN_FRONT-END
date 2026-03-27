# Tài liệu Use Case: User Profile

## 1. Thông tin chung
- **Tên màn hình**: Hồ sơ cá nhân (Personal Information)
- **File**: `ProfilePage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Quản lý thông tin cá nhân, ảnh đại diện và trạng thái bảo mật của người dùng.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-UP-01: Xem và Cập nhật thông tin cơ bản
- Hiển thị thông tin: Họ tên, Email (Chỉ xem), Số điện thoại, Ngày sinh, Địa chỉ.
- Cho phép chỉnh sửa (Inline Editing) và lưu thay đổi vào hệ thống.

### UC-UP-02: Quản lý Ảnh đại diện (Avatar)
- Cho phép tải ảnh lên từ máy tính.
- **Ràng buộc**: Định dạng ảnh hợp lệ, dung lượng dưới 2MB.
- Tự động chuẩn hóa ảnh sang Base64 để gửi API.

### UC-UP-03: Theo dõi Trạng thái Bảo mật (Security Status)
- Hiển thị huy hiệu "Đã xác thực" (Verified Badge) nếu thông tin người dùng đã được duyệt.
- Kiểm tra và hiển thị tình trạng đăng ký sinh trắc học khuôn mặt ngay tại trang Profile.
- Cung cấp lối tắt đến trang Quản lý Face ID nếu trạng thái là "Cần hành động".

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Cập nhật hồ sơ cá nhân
1. **Tên Use Case**: Chỉnh sửa thông tin cá nhân.
2. **Mô tả vắn tắt**: Người dùng thay đổi thông tin cá nhân và ảnh đại diện để cá nhân hóa tài khoản.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang "Profile".
        2) Hệ thống hiển thị thông tin hiện tại từ API.
        3) Người dùng nhấn chỉnh sửa các trường: Họ tên, Số điện thoại, Địa chỉ.
        4) Chọn ảnh đại diện mới từ thiết bị (Optional).
        5) Nhấn "Save Profile".
        6) Hệ thống tải ảnh (Base64) và gửi dữ liệu cập nhật lên server.
        7) Thông báo thành công và cập nhật lại thông tin hiển thị.
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Thông tin người dùng được cập nhật trong cơ sở dữ liệu.

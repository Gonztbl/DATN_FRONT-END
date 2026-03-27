# Tài liệu Use Case: UserManagePage

## 1. Thông tin chung
- **Tên màn hình**: Danh sách Người dùng (Admin)
- **File**: `UserManagePage.jsx`
- **Role**: Admin
- **Mô tả**: Trang tổng quan cho phép Quản trị viên quản trị toàn bộ người dùng trong hệ thống, cung cấp cái nhìn đa chiều về vai trò và trạng thái tài khoản.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-UMP-01: Hiển thị danh sách người dùng
- Hiển thị bảng danh sách với thông tin: ID, Username, Họ tên, SĐT, Email, Vai trò, Ngày tạo và Trạng thái.
- Hỗ trợ phân trang 10 người dùng trên mỗi trang.

### UC-UMP-02: Tìm kiếm đa trường
- Tìm kiếm đồng thời trên các trường: Username, Email, Họ tên và Số điện thoại.

### UC-UMP-03: Bộ lọc nâng cao
- **Lọc theo Trạng thái**: Hoạt động, Bị khóa.
- **Lọc theo Vai trò**: Quản trị viên, Người dùng, Tài xế, Chủ nhà hàng, Nhân viên hỗ trợ.

### UC-UMP-04: Quản lý trạng thái khóa (Lock/Unlock)
- Cho phép Quản trị viên bật/tắt quyền truy cập của người dùng ngay tại danh sách.

### UC-UMP-05: Điều hướng chi tiết
- Khi nhấn vào một hàng trong bảng, hệ thống điều hướng đến trang Chi tiết người dùng tương ứng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý người dùng (Admin)
1. **Tên Use Case**: Tra cứu và quản lý tài khoản.
2. **Mô tả vắn tắt**: Admin thực hiện giám sát danh sách người dùng, lọc theo vai trò và kiểm soát trạng thái hoạt động.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "User Management".
        2) Hệ thống hiển thị danh sách toàn bộ người dùng.
        3) Admin sử dụng ô tìm kiếm để lọc theo Tên/Email/SĐT.
        4) Admin chọn Role (ví dụ: Shipper) để xem danh sách tài xế.
        5) Admin nhấn nút Gạt (Switch) để Khóa/Mở khóa một tài khoản.
        6) Hệ thống cập nhật trạng thái ngay lập tức trên UI.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Trạng thái người dùng được cập nhật.

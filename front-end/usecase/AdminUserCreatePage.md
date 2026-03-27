# Tài liệu Use Case: AdminUserCreatePage

## 1. Thông tin chung
- **Tên màn hình**: Tạo Tài khoản Người dùng (Admin)
- **File**: `AdminUserCreatePage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên khởi tạo tài khoản mới cho các đối tượng trong hệ thống (Người dùng, Tài xế, Nhân viên hỗ trợ, Chủ nhà hàng).

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AUCP-01: Nhập liệu thông tin cơ bản
- Hỗ trợ nhập các trường: Tên đăng nhập (Username), Họ tên đầy đủ (Full Name), Email, Số điện thoại.

### UC-AUCP-02: Thiết lập mật khẩu
- Cho phép nhập mật khẩu và xác nhận lại mật khẩu.
- Hỗ trợ tính năng ẩn/hiện mật khẩu để kiểm tra độ chính xác khi nhập.

### UC-AUCP-03: Chọn vai trò hệ thống (Role)
- Quản trị viên chọn một trong các vai trò: `USER`, `SHIPPER`, `SUPPORT`, `RESTAURANT_OWNER`.
- Giao diện cung cấp các thẻ chọn vai trò kèm icon trực quan.

### UC-AUCP-04: Kiểm tra tính hợp lệ (Validation)
- **Username**: 4-20 ký tự, chỉ gồm chữ cái, số và dấu gạch dưới.
- **Email**: Đúng định dạng email tiêu chuẩn.
- **Số điện thoại**: Định dạng Việt Nam (bắt đầu bằng số 0, 10-11 số).
- **Mật khẩu**: Tối thiểu 8 ký tự, bao gồm cả chữ và số.
- **Xác nhận mật khẩu**: Phải khớp hoàn toàn với mật khẩu đã nhập.

### UC-AUCP-05: Xử lý trùng lặp (Conflict Handling)
- Hệ thống phải phát hiện và hiển thị lỗi cụ thể nếu Email, Username hoặc Số điện thoại đã tồn tại trong hệ thống (lỗi 409 từ server).

### UC-AUCP-06: Hồ sơ thành công
- Sau khi tạo thành công, hiển thị thông báo kèm Mã số tài khoản (AccountNumber) và điều hướng về trang quản lý người dùng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Tạo tài khoản người dùng mới (Admin)
1. **Tên Use Case**: Khởi tạo tài khoản hệ thống.
2. **Mô tả vắn tắt**: Admin tạo tài khoản cho các đối tượng người dùng khác nhau để họ có thể tham gia vào hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "Create User".
        2) Chọn vai trò (Role) cho tài khoản mới.
        3) Nhập đầy đủ thông tin: Username, Full Name, Email, Phone, Password.
        4) Nhấn "Create Account".
        5) Hệ thống kiểm tra tính duy nhất của Username/Email/SĐT. [A1]
        6) Hệ thống tạo tài khoản, khởi tạo ví điện tử và hiển thị thông báo thành công.
        7) Tự động quay lại trang danh sách người dùng.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Dữ liệu đã tồn tại**: Nếu Email hoặc Username đã có người sử dụng, hệ thống báo đỏ trường tương ứng và yêu cầu nhập lại.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Một tài khoản mới và một ví điện tử mới được tạo thành công.

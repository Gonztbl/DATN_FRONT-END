# Tài liệu Use Case: RegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký (Register)
- **File**: `RegisterPage.jsx`
- **Role**: Guest
- **Mô tả**: Giao diện cho phép người dùng mới tạo tài khoản SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-RP-01: Nhập liệu thông tin đăng ký
- Các trường: Username, Full Name, Email, Phone, Password, Confirm Password.

### UC-RP-02: Ràng buộc dữ liệu (Validation)
- Username: 4-20 ký tự (chỉ chữ, số, gạch dưới).
- Email: Định dạng email hợp lệ.
- Phone: Định dạng số điện thoại Việt Nam.
- Password: Tối thiểu 8 ký tự, bao gồm cả chữ và số.
- Confirm Password: Phải khớp với mật khẩu đã nhập.

### UC-RP-03: Khởi tạo dữ liệu
- Sau khi đăng ký thành công, hệ thống tự động khởi tạo mặc định một ví điện tử cho người dùng.

### UC-RP-04: Phản hồi sau đăng ký
- Hiển thị thông báo thành công kèm số tài khoản ví (AccountNumber) được cấp.
- Điều hướng người dùng về trang Login.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-RP-01: UX/UI
- Thông báo lỗi chi tiết (ví dụ: "Email đã tồn tại") ngay khi gặp lỗi 409 từ server.
- Sử dụng hiệu ứng mượt mà khi chuyển đổi giữa các bước nhập liệu.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký tài khoản (User Registration)
1. **Tên Use Case**: Đăng ký người dùng mới.
2. **Mô tả vắn tắt**: Người dùng mới tự tạo tài khoản để tham gia hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Đăng ký.
        2) Nhập Username, Full Name, Email, Phone, Password.
        3) Nhấn "Create Account".
        4) Hệ thống kiểm tra tính hợp lệ và duy nhất của dữ liệu. [A1]
        5) Hệ thống tạo tài khoản và ví mặc định.
        6) Hiển thị thông báo thành công kèm số tài khoản ví.
        7) Điều hướng về trang Đăng nhập.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Dữ liệu trùng lặp**: Hệ thống báo lỗi "Email/Username already exists" và yêu cầu thay đổi.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Một tài khoản `USER` mới được tạo.

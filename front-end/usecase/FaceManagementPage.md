# Tài liệu Use Case: FaceManagementPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Xác thực Khuôn mặt (Face ID Management)
- **File**: `FaceManagementPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện cho phép người dùng xem danh sách các góc mặt đã đăng ký và quản lý chúng (xóa hoặc đăng ký lại).

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FMP-01: Hiển thị danh sách góc mặt
- Hệ thống liệt kê 3 góc mặt: Chính diện, Trái, Phải.
- Hiển thị trạng thái "Đã đăng ký" hoặc "Chưa đăng ký" cho mỗi góc.

### UC-FMP-02: Quản lý Pose (Delete Pose)
- Cho phép người dùng xóa từng góc mặt đã đăng ký.
- Yêu cầu xác nhận (Confirmation Dialog) trước khi xóa.

### UC-FMP-03: Kiểm tra trạng thái bảo mật
- Hiển thị cảnh báo nếu người dùng chưa hoàn tất cả 3 góc mặt (Độ an toàn thấp).

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FMP-01: UX/UI
- Sử dụng icon trực quan (tích xanh, dấu X đỏ) để biểu thị trạng thái đăng ký.
- Cung cấp nút điều hướng nhanh đến trang đăng ký mới.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý mẫu khuôn mặt (Face Sample Management)
1. **Tên Use Case**: Xem và quản lý dữ liệu sinh trắc học.
2. **Mô tả vắn tắt**: Người dùng kiểm tra các mẫu khuôn mặt hiện có.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào trang "Biometric Management".
        2) Hệ thống hiển thị 3 trạng thái: Front, Left, Right.
        3) Người dùng nhấn biểu tượng "XÓA" để xóa một góc mặt cụ thể.
        4) Nhấn "Làm mới tất cả" để xóa toàn bộ các góc mặt đã đăng ký.
        5) Nhấn "Thêm góc mặt" hoặc "THÊM NGAY" để đi tới trang chụp ảnh khuôn mặt.
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Dữ liệu sinh trắc học được cập nhật.

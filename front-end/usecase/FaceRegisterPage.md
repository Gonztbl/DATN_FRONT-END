# Tài liệu Use Case: FaceRegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký Khuôn mặt (Face Registration)
- **File**: `FaceRegisterPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện hướng dẫn người dùng chụp các góc mặt để thiết lập bảo mật sinh trắc học.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FRP-01: Chụp ảnh 3 góc mặt (Multi-Angle Capture)
- Hệ thống hỗ trợ chụp 3 tư thế: Chính diện (Front), Góc trái (Left), Góc phải (Right).
- Tự động nhận diện tư thế qua khung Overlay Oval.

### UC-FRP-02: Kiểm tra chất lượng (Liveness/Quality Check)
- Đảm bảo khuôn mặt nằm trong khung hình và độ sáng đủ tốt.
- Hiển thị phản hồi khi chụp thành công từng góc.

### UC-FRP-03: Lưu mẫu sinh trắc học
- Sau khi chụp đủ 3 góc, hệ thống gửi dữ liệu lên server để lưu trữ mẫu (Face Embedding).

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FRP-01: Tính khả dụng
- Hướng dẫn bằng icon và chữ ngay trên luồng camera để người dùng dễ dàng thực hiện.
- Giải phóng tài nguyên camera ngay khi kết thúc hoặc thoát trang.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký khuôn mặt (Face Registration)
1. **Tên Use Case**: Thiết lập xác thực khuôn mặt.
2. **Mô tả vắn tắt**: Người dùng tự đăng ký các góc mặt để sử dụng cho việc xác thực giao dịch sau này.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào màn hình "Face Registration".
        2) Hệ thống hiển thị khung hướng dẫn (Oval overlay).
        3) Người dùng lần lượt chụp 3 ảnh: Thẳng, Trái, Phải.
        4) Hệ thống kiểm tra chất lượng ảnh. [A1]
        5) Hệ thống hiển thị tích xanh cho mỗi góc đã chụp thành công.
        6) Hệ thống lưu mẫu khuôn mặt vào cơ sở dữ liệu.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Ảnh không đạt yêu cầu**: Nếu mặt quá mờ, hệ thống yêu cầu chụp lại góc đó.
4. **Tiền điều kiện**: Thiết bị có camera.
5. **Hậu điều kiện**: Dữ liệu sinh trắc học được đăng ký.

# Tài liệu Use Case: FaceRegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký Khuôn mặt (Face Registration)
- **File**: `FaceRegisterPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện hướng dẫn người dùng chụp các góc mặt để thiết lập bảo mật sinh trắc học.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FRP-01: Chụp ảnh 3 góc mặt (Multi-Angle Capture)
- Hệ thống hỗ trợ chụp 3 tư thế: Mặt trước (Front), Quay trái (Left), Quay phải (Right).
- Người dùng nhấn nút "Chụp ảnh" (photo_camera) để thực hiện chụp cho từng góc.

### UC-FRP-02: Kiểm tra và Gửi dữ liệu
- Hiển thị phản hồi "Thành công" và tích xanh sau khi chụp thành công từng góc.
- Ảnh được gửi lên server qua `faceService.registerFace` kèm theo định danh tư thế (pose).

### UC-FRP-03: Chế độ chụp đơn (Single Pose)
- Hệ thống hỗ trợ bổ sung một góc mặt cụ thể nếu được yêu cầu từ trang quản lý.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FRP-01: UX/UI
- Giao diện Live Camera với hiệu ứng quét (Scanning overlay) và nháy đèn (Flash effect) khi chụp.
- Hiển thị thanh tiến trình 3 bước trực quan bên cạnh khung hình Camera.
- Chế độ Dark/Light mode đồng bộ hệ thống.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký khuôn mặt (Face Registration)
1. **Tên Use Case**: Thiết lập xác thực khuôn mặt.
2. **Mô tả vắn tắt**: Người dùng tự đăng ký các góc mặt để sử dụng cho việc xác thực giao dịch sau này.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào màn hình "Face Registration".
        2) Hệ thống khởi tạo Camera và hiển thị luồng video.
        3) Người dùng điều chỉnh mặt vào khung và nhấn nút chụp cho góc hiện tại (ví dụ: Mặt trước).
        4) Hệ thống gửi ảnh lên server và hiển thị thông báo "Đã lưu góc mặt".
        5) Chuyển sang bước tiếp theo cho đến khi đủ 3 góc (Front -> Left -> Right).
        6) Sau khi hoàn tất, hệ thống điều hướng về trang quản lý bảo mật.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Lỗi camera**: Nếu không truy cập được camera, hệ thống hiển thị thông báo yêu cầu cấp quyền.
4. **Tiền điều kiện**: Thiết bị có camera, người dùng đã đăng nhập.
5. **Hậu điều kiện**: Các mẫu khuôn mặt được lưu trữ trên server.

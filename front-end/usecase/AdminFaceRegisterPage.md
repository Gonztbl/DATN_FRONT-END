# Tài liệu Use Case: AdminFaceRegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký Sinh trắc học Khuôn mặt (Admin)
- **File**: `AdminFaceRegisterPage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên thực hiện quy trình đăng ký dữ liệu khuôn mặt cho một người dùng cụ thể trong hệ thống.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AFR-01: Hiển thị thông tin người dùng mục tiêu
- Hệ thống phải tự động lấy và hiển thị tên đầy đủ hoặc tên đăng nhập của người dùng đang được đăng ký dựa trên ID từ URL.

### UC-AFR-02: Truy cập Camera
- Hệ thống phải yêu cầu và nhận được quyền truy cập vào camera của thiết bị để thực hiện quay video trực tiếp.
- Hiển thị khung hình video trực tiếp với lớp phủ (overlay) hướng dẫn vị trí đặt khuôn mặt.

### UC-AFR-03: Đăng ký theo từng tư thế (3 bước)
- **Bước 1 (Chính diện)**: Chụp và gửi ảnh khuôn mặt nhìn thẳng.
- **Bước 2 (Nghiêng trái)**: Chụp và gửi ảnh khuôn mặt quay sang trái 45 độ.
- **Bước 3 (Nghiêng phải)**: Chụp và gửi ảnh khuôn mặt quay sang phải 45 độ.

### UC-AFR-04: Chụp và Gửi ảnh
- Khi nhấn nút "Capture", hệ thống chụp ảnh từ luồng video hiện tại.
- Tự động chuyển đổi ảnh sang định dạng Blob/File (image/jpeg).
- Gửi ảnh cùng thông tin tư thế (pose) và ID người dùng lên server thông qua `faceService`.

### UC-AFR-05: Xem trước ảnh đã chụp
- Hiển thị các ô xem trước (preview) cho từng tư thế sau khi đã được lưu thành công.

### UC-AFR-06: Hoàn tất quy trình
- Sau khi hoàn thành đủ 3 tư thế, hệ thống thông báo thành công và tự động điều hướng quay lại trang chi tiết người dùng (`UserDetailPage`).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký khuôn mặt Admin (Biometric Registration)
1. **Tên Use Case**: Đăng ký sinh trắc học cho người dùng.
2. **Mô tả vắn tắt**: Admin thực hiện lấy mẫu khuôn mặt 3 tư thế để phục vụ tính năng xác thực sinh trắc học.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang đăng ký khuôn mặt cho một User ID cụ thể.
        2) Hệ thống yêu cầu quyền camera và hiển thị luồng video.
        3) Admin hướng dẫn người dùng thực hiện 3 tư thế: Chính diện, Nghiêng trái, Nghiêng phải. [A1]
        4) Với mỗi tư thế, Admin nhấn "Capture".
        5) Hệ thống chụp ảnh, hiển thị preview và gửi dữ liệu lên server.
        6) Sau khi hoàn thành đủ 3 ảnh, hệ thống thông báo thành công.
        7) Tự động quay lại trang chi tiết người dùng.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Lỗi camera**: Nếu không thể mở camera, hệ thống hiển thị thông báo "Camera access denied" và dừng quy trình.
4. **Tiền điều kiện**: Đăng nhập quyền Admin và User ID mục tiêu tồn tại.
5. **Hậu điều kiện**: Dữ liệu khuôn mặt được lưu trữ và gán cho người dùng tương ứng.

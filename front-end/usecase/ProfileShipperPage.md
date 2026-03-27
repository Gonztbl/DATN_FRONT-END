# Tài liệu Use Case: ProfileShipperPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Hồ sơ Tài xế
- **File**: `ProfileShipperPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Cho phép tài xế cập nhật thông tin cá nhân, phương tiện di chuyển và kiểm soát trạng thái làm việc trực tuyến.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-PSP-01: Quản lý Trạng thái Trực tuyến (Online/Offline)
- Cung cấp nút gạt (Toggle Switch) để tài xế bật/tắt trạng thái làm việc.
- Chỉ khi "Online", tài xế mới được hệ thống gán đơn hoặc nhìn thấy đơn hàng mới.

### UC-PSP-02: Quản lý Ảnh đại diện
- Cho phép tải ảnh lên từ thư viện hoặc chụp trực tiếp.
- Kiểm soát dung lượng ảnh (dưới 2MB).
- Xem trước ảnh (Preview) ngay khi chọn.

### UC-PSP-03: Cập nhật Thông tin cơ bản
- Hỗ trợ chỉnh sửa: Họ và tên, Số điện thoại liên hệ, Email cá nhân.
- Hiển thị Mã số định danh (Shipper ID) duy nhất của tài xế.

### UC-PSP-04: Cập nhật Thông tin Phương tiện
- **Loại xe**: Cho phép chọn Xe máy (Motorcycle), Xe tải (Truck), hoặc Xe điện (Electric).
- **Biển số xe**: Ô nhập liệu tự động viết hoa biển số để chuẩn hóa dữ liệu.

### UC-PSP-05: Lưu thay đổi đồng bộ
- Sử dụng cơ chế cập nhật đồng thời (Promise.all) để lưu cả thông tin hồ sơ và phương tiện trong một lần nhấn nút, đảm bảo tính toàn vẹn dữ liệu.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Điều chỉnh trạng thái trực tuyến
1. **Tên Use Case**: Bật/Tắt trạng thái làm việc.
2. **Mô tả vắn tắt**: Tài xế thay đổi trạng thái để hệ thống biết có thể gán đơn hàng cho mình hay không.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế truy cập trang hồ sơ cá nhân.
        2) Nhấn vào nút gạt (Toggle) Online/Offline.
        3) Hệ thống gửi yêu cầu cập nhật lên server.
        4) Giao diện thay đổi màu sắc và nhãn trạng thái tương ứng.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống.
5. **Hậu điều kiện**: Trạng thái "Online" cho phép nhận đơn, "Offline" sẽ không nhận được đơn mới.

### 4.2 Mô tả usecase Cập nhật thông tin phương tiện
1. **Tên Use Case**: Chỉnh sửa thông tin xe.
2. **Mô tả vắn tắt**: Tài xế cập nhật loại xe và biển số xe để khách hàng và nhà hàng nhận diện.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế nhập Loại xe (Motorcycle, Truck...) và Biển số xe vào form.
        2) Nhấn nút "Save Profile".
        3) Hệ thống hiển thị loading và thực hiện cập nhật đồng thời thông tin cá nhân và phương tiện.
        4) Thông báo "Profile updated successfully" hiển thị.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Thông tin xe được cập nhật và hiển thị trên các đơn hàng shipper nhận.

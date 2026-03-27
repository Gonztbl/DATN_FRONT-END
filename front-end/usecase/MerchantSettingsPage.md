# Tài liệu Use Case: MerchantSettingsPage

## 1. Thông tin chung
- **Tên màn hình**: Cài đặt Nhà hàng (Merchant Settings)
- **File**: `MerchantSettingsPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Trang cấu hình thông tin cơ bản và thời gian vận hành của cửa hàng trên hệ thống SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MSP-01: Quản lý trạng thái Mở/Đóng cửa tức thì
- Cung cấp nút gạt để chủ quán có thể ngay lập tức ngừng nhận đơn (ví dụ khi quán quá tải đột xuất) hoặc mở lại.

### UC-MSP-02: Cập nhật Thông tin liên hệ
- Cho phép sửa Số điện thoại và Địa chỉ kinh doanh của quán.
- **Lưu ý**: Tên nhà hàng thường cố định theo giấy phép (Read-only) để đảm bảo tính xác thực.

### UC-MSP-03: Cấu hình Giờ hoạt động (Operating Hours)
- Cho phép thiết lập lịch làm việc chi tiết cho từng ngày trong tuần (Thứ 2 đến Chủ nhật).
- **Tính năng cho mỗi ngày**: 
    - Bật/Tắt ngày làm việc (isOpen toggle).
    - Chọn Giờ mở cửa và Giờ đóng cửa cụ thể.

### UC-MSP-04: Lưu trữ và Đồng bộ
- Nút "Lưu cài đặt" giúp đồng bộ toàn bộ thay đổi lên hệ thống.
- Yêu cầu xác nhận (Swal) khi thực hiện chuyển đổi trạng thái cửa hàng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Thiết lập cửa hàng (Store Settings)
1. **Tên Use Case**: Cập nhật thông tin và giờ hoạt động.
2. **Mô tả vắn tắt**: Chủ cửa hàng cấu hình các thông số vận hành của quán trên hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán truy cập trang "Settings".
        2) Chỉnh sửa SĐT, Địa chỉ hoặc trạng thái Mở/Đóng cửa.
        3) Thiết lập Giờ mở/đóng cửa cho từng ngày trong tuần.
        4) Nhấn "Save Settings".
        5) Hệ thống hiển thị loading và thông báo lưu thành công.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống.
5. **Hậu điều kiện**: Thông tin quán được cập nhật và áp dụng ngay lập tức cho các đơn hàng mới.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-MSP-01: Thiết kế giao diện (UI)
- Sử dụng các khung nhập liệu (Input) và chọn giờ (Time Picker) trực quan, chuẩn hóa.
- Hiển thị trạng thái "Nghỉ đóng cửa" xám mờ cho các ngày không hoạt động.

### NFR-MSP-02: Phản hồi hệ thống
- Tự động làm mới dữ liệu (Fetch) sau khi lưu thành công để đảm bảo chủ quán luôn thấy thông tin mới nhất.
- Hiển thị trạng thái "Đang lưu..." trên nút bấm để người dùng không nhấn liên tục.

### NFR-MSP-03: Trải nghiệm người dùng (UX)
- Phân tách rõ ràng các nhóm thông tin (Trạng thái, Thông tin cơ bản, Giờ hoạt động) bằng các Section có tiêu đề riêng biệt.

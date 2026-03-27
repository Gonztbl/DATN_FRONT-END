# Tài liệu Use Case: MerchantDashboardPage

## 1. Thông tin chung
- **Tên màn hình**: Bảng điều khiển Chủ nhà hàng (Merchant Dashboard)
- **File**: `MerchantDashboardPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Trang quản trị trung tâm dành cho chủ cửa hàng để theo dõi tình hình kinh doanh, doanh thu và kiểm soát trạng thái hoạt động của quán.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MDP-01: Kiểm soát trạng thái cửa hàng (Open/Closed)
- Cung cấp nút gạt (Toggle Switch) để mở hoặc đóng cửa quán trên ứng dụng khách hàng.
- **Xác nhận hành động**: Hiển thị hộp thoại cảnh báo (Swal) trước khi thay đổi trạng thái để tránh nhầm lẫn.

### UC-MDP-02: Theo dõi Số dư Ví SmartPay
- Hiển thị số dư thực tế mà chủ quán nhận được (sau khi trừ chiết khấu hệ thống).
- Hiển thị xu hướng thay đổi số dư theo tỷ lệ % hàng tháng.

### UC-MDP-03: Thống kê doanh thu và đơn hàng
- **Doanh thu hôm nay**: Tổng tiền thu được từ các đơn hàng thành công trong ngày (tính 95% giá trị đơn).
- **Đơn hàng mới**: Số lượng đơn hàng phát sinh trong ngày.
- **Đang xử lý**: Tổng số đơn hàng ở trạng thái Chờ duyệt hoặc Đang chuẩn bị món.

### UC-MDP-04: Biểu đồ doanh thu tuần
- Hiển thị biểu đồ cột (Bar Chart) minh họa doanh thu của 7 ngày gần nhất.
- Hỗ trợ định dạng số tiền rút gọn (M cho triệu, K cho ngàn) để giao diện gọn gàng.

### UC-MDP-05: Danh sách đơn hàng gần đây
- Liệt kê 5 đơn hàng mới nhất với các thông tin: Mã đơn, Thời gian, Tên khách hàng, Tổng tiền, Trạng thái.
- Cho phép xem nhanh chi tiết đơn hàng bằng một cú click.

### UC-MDP-06: Xử lý tài khoản chưa có quán
- Trường hợp tài khoản chủ quán chưa được liên kết với nhà hàng nào, hệ thống phải hiển thị màn hình thông báo lỗi và hướng dẫn liên hệ Quản trị viên.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý hoạt động cửa hàng (Merchant Dashboard)
1. **Tên Use Case**: Theo dõi và điều phối cửa hàng.
2. **Mô tả vắn tắt**: Chủ cửa hàng xem doanh thu, số lượng đơn hàng và điều chỉnh trạng thái đóng/mở cửa.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán đăng nhập và vào trang Dashboard.
        2) Hệ thống hiển thị các chỉ số: Doanh thu ngày, Đơn hàng mới, Số dư ví.
        3) Chủ quán nhấn nút Toggle để thay đổi trạng thái "Open/Closed".
        4) Hệ thống hiển thị hộp thoại xác nhận.
        5) Chủ quán xác nhận, hệ thống cập nhật trạng thái cửa hàng trên toàn ứng dụng.
4. **Tiền điều kiện**: Tài khoản đã được gán quyền chủ nhà hàng và đã liên kết với một cụm nhà hàng.
5. **Hậu điều kiện**: Trạng thái cửa hàng thay đổi ảnh hưởng đến khả năng đặt hàng của khách.

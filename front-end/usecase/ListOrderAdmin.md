# Tài liệu Use Case: ListOrderAdmin

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Đơn hàng Toàn hệ thống (Admin)
- **File**: `ListOrderAdmin.jsx`
- **Role**: Admin
- **Mô tả**: Trung tâm giám sát đơn hàng cho phép Quản trị viên theo dõi luồng vận hành của tất cả các đơn hàng từ khi khách đặt đến khi giao hàng thành công.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-LOA-01: Hiển thị danh sách đơn hàng tổng thể
- Liệt kê đơn hàng với các cột: Mã đơn (#ID), Khách hàng, Nhà hàng, Shipper, Tổng tiền, Trạng thái, và Thời gian tạo.

### UC-LOA-02: Hệ thống bộ lọc chuyên sâu
- **Theo trạng thái**: Pending, Confirmed, Preparing, Delivering, Completed, Cancelled, Delivery Failed.
- **Theo chủ thể**: Lọc đơn hàng của một Nhà hàng cụ thể hoặc một Shipper cụ thể.
- **Theo thời gian**: Lọc đơn hàng phát sinh trong khoảng thời gian (Từ ngày - Đến ngày).

### UC-LOA-03: Tìm kiếm thông minh
- Hỗ trợ tìm kiếm theo Mã đơn hàng, Tên người nhận, Số điện thoại hoặc Tên đăng nhập của khách hàng.

### UC-LOA-04: Xem chi tiết và Xóa đơn
- Điều hướng nhanh đến trang chi tiết để xử lý đơn hàng.
- Cho phép xóa đơn hàng khỏi hệ thống sau khi xác nhận (dành cho quản trị cấp cao).

### UC-LOA-05: Phân trang dữ liệu
- Quản lý danh sách hàng nghìn đơn hàng thông qua cơ chế phân trang của API.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Giám sát đơn hàng toàn hệ thống (Admin)
1. **Tên Use Case**: Tra cứu và quản lý đơn hàng.
2. **Mô tả vắn tắt**: Admin theo dõi toàn bộ luồng đơn hàng và can thiệp nếu cần thiết (xóa đơn/kiểm tra lỗi).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "Order Management".
        2) Hệ thống hiển thị danh sách tất cả các đơn hàng.
        3) Admin sử dụng ô tìm kiếm để lọc theo Mã đơn, Tên khách, SĐT.
        4) Admin chọn bộ lọc Trạng thái (Pending, Delivered...) hoặc lọc theo Nhà hàng/Shipper.
        5) Admin nhấn "View" để xem chi tiết hoặc "Delete" để xóa đơn (sau khi xác nhận).
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Không có.

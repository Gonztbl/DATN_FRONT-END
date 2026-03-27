# Tài liệu Use Case: ShipperDashboardPage

## 1. Thông tin chung
- **Tên màn hình**: Bảng điều khiển Tài xế (Shipper Dashboard)
- **File**: `ShipperDashboardPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Trung tâm chỉ huy cho tài xế, cung cấp tóm tắt về hiệu suất làm việc, thu nhập và truy cập nhanh vào đơn hàng đang thực hiện.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-SDP-01: Truy cập nhanh đơn hàng đang giao (Active Order)
- Hiển thị Banner nổi bật nếu tài xế đang có đơn hàng ở trạng thái `READY_FOR_PICKUP` hoặc `DELIVERING`.
- Cung cấp nút "Tiếp tục giao" để chuyển nhanh đến trang chi tiết đơn hàng đó.

### UC-SDP-02: Theo dõi Ví hoa hồng
- Hiển thị số dư hiện tại trong Ví hoa hồng của tài xế (mức phí shipper nhận được từ mỗi đơn hàng).
- Thể hiện sự thay đổi số dư theo chu kỳ tháng.

### UC-SDP-03: Thống kê hiệu suất (Stats)
- Hiển thị các chỉ số quan trọng: Tổng số đơn hàng, Số đơn giao thành công, Tổng doanh thu (VNĐ), Số đơn giao trong ngày hôm nay.

### UC-SDP-04: Biểu đồ khối lượng đơn hàng
- Hiển thị biểu đồ cột (Bar Chart) minh họa số lượng đơn hàng hoàn thành trong 7 ngày gần nhất (Thứ 2 đến Chủ nhật).
- Tự động highlight ngày hiện tại trên biểu đồ.

### UC-SDP-05: Lịch sử hoạt động gần đây
- Liệt kê 5 đơn hàng mới nhất kèm Mã đơn, Thời gian, Số tiền và Trạng thái (Hoàn thành, Thất bại, Đang giao).
- Cho phép nhấn vào từng đơn để xem chi tiết.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Theo dõi hiệu suất làm việc (Shipper Dashboard)
1. **Tên Use Case**: Xem thống kê và thu nhập.
2. **Mô tả vắn tắt**: Tài xế theo dõi các chỉ số quan trọng, thu nhập thực tế và các đơn hàng đang hoạt động.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế đăng nhập và vào màn hình Dashboard.
        2) Hệ thống hiển thị số lượng đơn hàng đã giao, đơn thành công và tổng thu nhập (5% mỗi đơn).
        3) Hệ thống hiển thị biểu đồ cột xu hướng trong 7 ngày qua. [A1]
        4) Nếu có đơn đang giao, hệ thống hiển thị Banner "Active Order" ở trên cùng.
        5) Tài xế nhấn "Continue" trên banner để quay lại xử lý đơn.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không có dữ liệu**: Nếu tài xế mới đăng ký hoặc chưa giao đơn nào, các chỉ số hiển thị là 0 và biểu đồ trống.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống với quyền Shipper.
5. **Hậu điều kiện**: Không có.

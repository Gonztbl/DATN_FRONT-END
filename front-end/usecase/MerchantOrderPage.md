# Tài liệu Use Case: MerchantOrderPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Đơn hàng (Merchant Orders)
- **File**: `MerchantOrderPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Trang quản lý tập trung toàn bộ vòng đời của đơn hàng tại quán, giúp quy trình xử lý món ăn trở nên chuyên nghiệp và chính xác.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MOP-01: Quản lý đơn theo quy trình (Tabs)
- Chia đơn hàng thành các trạng thái:
    - **Chờ duyệt (PENDING)**: Đơn mới từ khách hàng cần quán xác nhận nhận đơn.
    - **Đã xác nhận (CONFIRMED)**: Quán đang trong quá trình chế biến món ăn.
    - **Sẵn sàng (READY_FOR_PICKUP)**: Món đã xong, chờ tài xế đến lấy.
    - **Đang giao (DELIVERING)**: Tài xế đã lấy hàng và đang đi giao.
    - **Hoàn tất (COMPLETED)**: Đơn hàng giao thành công.
    - **Đã hủy (CANCELLED)**: Đơn bị hủy bởi khách hoặc quán.

### UC-MOP-02: Xác nhận nhận đơn
- Chủ quán có thể nhấn "Xác nhận" ngay tại danh sách để bắt đầu chế biến.

### UC-MOP-03: Báo món sẵn sàng (Mark Ready)
- Khi chế biến xong, chủ quán nhấn "Báo Món Sẵn Sàng" để hệ thống thông báo cho tài xế.

### UC-MOP-04: Từ chối đơn hàng (Reject)
- Cho phép quán từ chối đơn hàng (ví dụ: do hết món, quá tải).
- Yêu cầu nhập lý do từ chối để thông báo cho khách hàng.

### UC-MOP-05: Tìm kiếm đơn hàng
- Hỗ trợ tìm kiếm theo Mã đơn hàng hoặc Tên khách hàng để truy xuất nhanh thông tin.

### UC-MOP-06: Phân trang (Pagination)
- Quản lý danh sách đơn hàng lớn (10 đơn/trang) giúp trang tải nhanh và dễ theo dõi.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Xử lý đơn hàng (Order Processing)
1. **Tên Use Case**: Xác nhận và chế biến đơn hàng.
2. **Mô tả vắn tắt**: Chủ cửa hàng tiếp nhận đơn hàng mới và cập nhật trạng thái theo tiến độ chế biến.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán truy cập tab "Pending" để xem các đơn hàng mới.
        2) Nhấn nút "Confirm" để chấp nhận đơn. Trạng thái chuyển sang "CONFIRMED".
        3) Sau khi chế biến xong, chủ quán nhấn "Mark Ready". Trạng thái chuyển sang "READY_FOR_PICKUP".
        4) Hệ thống thông báo cho phí Shipper đến nhận hàng.
        5) Khi Shipper lấy hàng, trạng thái chuyển sang "DELIVERING".
    - **3.2 Các luồng rẽ nhánh**:
        1) **Từ chối đơn hàng**: Tại bước 2, nếu không thể thực hiện đơn (hết món/quá tải), chủ quán nhấn "Reject" và nhập lý do. Đơn chuyển sang "CANCELLED".
4. **Tiền điều kiện**: Có đơn hàng mới được gửi đến nhà hàng.
5. **Hậu điều kiện**: Đơn hàng được cập nhật trạng thái và thông báo cho các bên liên quan (Khách hàng/Shipper).

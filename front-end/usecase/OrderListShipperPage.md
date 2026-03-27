# Tài liệu Use Case: OrderListShipperPage

## 1. Thông tin chung
- **Tên màn hình**: Danh sách Đơn hàng của Tài xế
- **File**: `OrderListShipperPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Quản lý các giai đoạn của đơn hàng từ khi chờ nhận đến khi hoàn tất hoặc thất bại.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-OLSP-01: Phân loại đơn hàng theo trạng thái (Tabs)
- **Chờ nhận (PENDING)**: Hiển thị các đơn hàng hệ thống đang cần tài xế (trạng thái `READY_FOR_PICKUP`, chưa gán tài xế).
- **Đang giao (DELIVERING)**: Danh sách đơn hàng tài xế đã nhận nhưng chưa giao xong (bao gồm cả đơn đang lấy hàng và đơn đang trên đường đi).
- **Đã giao (COMPLETED)**: Lịch sử các đơn hàng giao thành công.
- **Thất bại (FAILED)**: Các đơn hàng không thể giao đến khách.

### UC-OLSP-02: Nhận đơn hàng mới
- Trong tab "Chờ nhận", tài xế có thể nhấn "Nhận đơn" để gán mình vào đơn hàng đó.

### UC-OLSP-03: Xác nhận lấy hàng (Pick up)
- Đối với đơn hàng trong tab "Đang giao" có trạng thái `READY_FOR_PICKUP`, cung cấp nút "Lấy hàng" để cập nhật trạng thái đơn thành `DELIVERING`.

### UC-OLSP-04: Xem tóm tắt thông tin đơn hàng
- Mỗi thẻ đơn hàng hiển thị: Mã đơn, Thời gian đặt, Tên khách hàng, Số điện thoại (ẩn/hiện tùy bảo mật), Địa chỉ giao hàng (rút gọn), và Tổng số tiền.

### UC-OLSP-05: Chuyển hướng xử lý chi tiết
- Cung cấp nút "Chi tiết" hoặc "Giao hàng" để đi sâu vào trang điều phối đơn hàng cụ thể.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Nhận đơn hàng (Accept Order)
1. **Tên Use Case**: Nhận đơn hàng mới.
2. **Mô tả vắn tắt**: Tài xế chọn và nhận các đơn hàng đang ở trạng thái "Sẵn sàng" để đi giao.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế truy cập tab "Pending" (Chờ nhận).
        2) Hệ thống hiển thị danh sách các đơn hàng chưa có tài xế.
        3) Tài xế nhấn nút "Accept" trên một đơn hàng cụ thể.
        4) Hệ thống kiểm tra xem đơn hàng đã bị ai nhận chưa. [A1]
        5) Hệ thống gán ID tài xế vào đơn hàng và chuyển đơn sang tab "Delivering".
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Đơn hàng đã bị nhận**: Nếu trong lúc tài xế nhấn nút, đã có tài xế khác nhận đơn thành công, hệ thống hiển thị thông báo "Order already taken" và làm mới danh sách.
4. **Tiền điều kiện**: Tài xế đang ở trạng thái "Online".
5. **Hậu điều kiện**: Đơn hàng được gán cho tài xế và sẵn sàng để lấy hàng.

### 4.2 Mô tả usecase Lấy hàng tại quán (Pick up)
1. **Tên Use Case**: Xác nhận đã lấy hàng.
2. **Mô tả vắn tắt**: Tài xế xác nhận đã nhận hàng vật lý từ nhà hàng để bắt đầu đi giao.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế di chuyển đến nhà hàng.
        2) Truy cập tab "Delivering" và tìm đơn hàng tương ứng.
        3) Nhấn nút "Pick up".
        4) Hệ thống cập nhật trạng thái đơn thành `DELIVERING` (Đang giao).
4. **Tiền điều kiện**: Đơn hàng đã được tài xế nhận và đang ở trạng thái `READY_FOR_PICKUP`.
5. **Hậu điều kiện**: Trạng thái đơn hàng chuyển sang `DELIVERING`.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-OLSP-01: Tính nhất quán trạng thái (Filtering)
- Phải đảm bảo lọc đúng đơn hàng dựa trên ID tài xế đang đăng nhập (trừ tab PENDING là đơn chung).

### NFR-OLSP-02: Phản hồi nhanh (Instant Feedback)
- Khi tài xế nhận đơn, hệ thống phải cập nhật danh sách ngay lập tức để tránh tình trạng nhiều tài xế nhận cùng một đơn (Concurrency handling).

### NFR-OLSP-03: Giao diện trực quan
- Các trạng thái phải được gắn nhãn màu sắc (Badge) đặc trưng: Chờ lấy (Vàng), Đang giao (Xanh dương), Thành công (Xanh lá), Thất bại (Đỏ).
- Hỗ trợ cuộn trang (Infinite scroll hoặc phân trang) khi danh sách dài.

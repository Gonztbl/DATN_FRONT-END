# Tài liệu Use Case: OrderDetailShipperPage

## 1. Thông tin chung
- **Tên màn hình**: Điều phối Chi tiết Đơn hàng (Shipper Detail)
- **File**: `OrderDetailShipperPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Trang làm việc chính của tài xế khi thực hiện một đơn hàng cụ thể, tích hợp các công cụ liên lạc và chỉ đường.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-ODSP-01: Thông tin liên lạc Khách hàng
- Hiển thị tên, số điện thoại và địa chỉ giao hàng.
- **Nút "Gọi điện"**: Tự động kích hoạt ứng dụng cuộc gọi trên điện thoại với số của khách hàng.
- **Nút "Bản đồ"**: Mở Google Maps điều dẫn đến tọa độ vị trí khách hàng.

### UC-ODSP-02: Thông tin Nhà hàng (Điểm lấy hàng)
- Hiển thị logo, tên nhà hàng và nút "Chỉ đường" để tài xế đến lấy món.

### UC-ODSP-03: Kiểm soát giỏ hàng (Checklist)
- Liệt kê chi tiết các món ăn, số lượng và tổng tiền để tài xế đối soát khi nhận hàng từ quán.
- Hiển thị ghi chú cụ thể của khách (ví dụ: "Không lấy hành", "Giao trước 12h").

### UC-ODSP-04: Quy trình Giao hàng (Workflow Actions)
- **Xác nhận Lấy hàng**: Chuyển trạng thái từ Chờ lấy sang Đang giao.
- **Xác nhận Giao hàng**: Hoàn tất đơn hàng. Hệ thống ghi nhận thời gian hoàn thành chính xác.

### UC-ODSP-05: Báo cáo Giao hàng Thất bại
- Cung cấp tính năng báo cáo nếu không thể hoàn thành đơn.
- **Chọn lý do**: Khách vắng nhà, Sai địa chỉ, Không liên lạc được, Khách từ chối nhận, v.v.
- **Ghi chú**: Cho phép tài xế nhập mô tả chi tiết tình huống.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Thực hiện giao hàng (Delivery Execution)
1. **Tên Use Case**: Giao hàng cho khách.
2. **Mô tả vắn tắt**: Tài xế thực hiện các bước giao hàng vật lý và cập nhật trạng thái hoàn tất đơn hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế xem địa chỉ và SĐT khách hàng trên trang chi tiết.
        2) Sử dụng nút "Giao hàng" (Delivered) sau khi đã đưa hàng cho khách.
        3) Hệ thống kiểm tra hình thức thanh toán.
        4) Nếu là thanh toán bằng Ví, hệ thống thực hiện phân phối tiền (95% quán, 5% shipper).
        5) Hệ thống hiển thị thông báo thành công và tự động quay lại trang danh sách sau 5 giây.
    - **3.2 Các luồng rẽ nhánh**:
        1) **Giao hàng thất bại**: Nếu không thể giao (sai địa chỉ/không gọi được khách), tài xế nhấn "Report Failure" và chọn lý do. Đơn chuyển sang trạng thái `FAILED`.
4. **Tiền điều kiện**: Tài xế đã lấy hàng thành công từ nhà hàng.
5. **Hậu điều kiện**: Đơn hàng kết thúc chu kỳ giao.

### 4.2 Mô tả usecase Liên lạc và Chỉ đường
1. **Tên Use Case**: Hỗ trợ liên lạc và dẫn đường.
2. **Mô tả vắn tắt**: Tài xế sử dụng các công cụ tích hợp để tối ưu quãng đường di chuyển và liên lạc với các bên.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Nhấn icon "Phone" để gọi điện cho khách hàng hoặc nhà hàng.
        2) Nhấn icon "Map" để mở ứng dụng Google Maps dẫn đường đến địa chỉ đích.
4. **Tiền điều kiện**: Thiết bị có cài đặt ứng dụng gọi điện và bản đồ.
5. **Hậu điều kiện**: Không có.

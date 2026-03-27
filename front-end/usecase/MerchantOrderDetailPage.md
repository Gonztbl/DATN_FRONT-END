# Tài liệu Use Case: MerchantOrderDetailPage

## 1. Thông tin chung
- **Tên màn hình**: Chi tiết Đơn hàng (Merchant Order Detail)
- **File**: `MerchantOrderDetailPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Cung cấp đầy đủ thông tin về một đơn hàng đơn lẻ, bao gồm chi tiết món ăn, thông tin khách hàng và lịch sử thay đổi để phục vụ việc chế biến và đối soát.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MODP-01: Hiển thị chi tiết món ăn (Invoice view)
- Liệt kê danh sách món ăn kèm ảnh, số lượng, đơn giá và tổng số tiền của mỗi món.
- Tính toán Tổng thanh toán cuối cùng của đơn hàng.

### UC-MODP-02: Thông tin Khách hàng
- Hiển thị đầy đủ: Tên khách hàng, Số điện thoại, Địa chỉ giao hàng.
- **Ghi chú đặc biệt**: Hiển thị nổi bật yêu cầu riêng của khách (ví dụ: "Ít cay", "Đừng để hành").

### UC-MODP-03: Thông tin Thanh toán và Vận chuyển
- Hiển thị phương thức thanh toán (Ví SmartPay, Tiền mặt, v.v.).
- Hiển thị Mã số tài xế (Shipper ID) nếu đơn đã có tài xế nhận.

### UC-MODP-04: Lịch sử cập nhật (Timeline)
- Hiển thị dòng thời gian các mốc quan trọng của đơn (Thời điểm đặt, Thời điểm xác nhận, Thời điểm sẵn sàng).

### UC-MODP-05: Thao tác điều phối đơn hàng
- Cung cấp các nút hành động dựa trên trạng thái hiện tại:
    - Nút "Nhận Đơn Hàng" và "Từ Chối" (Khi đang PENDING).
    - Nút "Đã Làm Xong Món" (Khi đang CONFIRMED).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Xử lý đơn hàng tại nhà hàng (Merchant)
1. **Tên Use Case**: Tiếp nhận và chế biến đơn hàng.
2. **Mô tả vắn tắt**: Chủ nhà hàng kiểm tra chi tiết món ăn và điều phối quy trình nấu nướng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán nhận đơn hàng mới (Pending).
        2) Nhấn "Accept" để xác nhận nhận đơn.
        3) In hóa đơn hoặc xem danh sách món để chế biến.
        4) Nhấn "Ready for Pickup" sau khi nấu xong.
        5) Hệ thống thông báo cho Shipper đến lấy hàng.
    - **3.2 Luồng từ chối đơn**:
        1) Chủ quán nhấn "Reject" (nếu hết hàng hoặc quá tải).
        2) Chọn lý do từ chối.
        3) Hệ thống hủy đơn và hoàn tiền cho khách (nếu thanh toán ví).
4. **Tiền điều kiện**: Đã đăng nhập quyền Merchant.
5. **Hậu điều kiện**: Trạng thái đơn hàng chuyển sang READY_FOR_PICKUP.

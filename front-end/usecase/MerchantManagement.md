# Tài liệu Use Case: Quản lý Nhà hàng (Merchant Management)

## 2.5.1 Mô tả use case: Theo dõi doanh thu và trạng thái cửa hàng (Dashboard)
1. **Tên Use Case**: Theo dõi doanh thu và trạng thái cửa hàng.
2. **Mô tả vắn tắt**: Cho phép Chủ nhà hàng xem tổng quan hiệu quả kinh doanh, số dư ví và điều chỉnh trạng thái hoạt động của quán (Đóng/Mở cửa).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản (Xem thống kê)**:
        1) Chủ nhà hàng truy cập Dashboard.
        2) Hệ thống hiển thị các chỉ số: Số dư ví, Doanh thu hôm nay (95% tổng giá trị đơn), Số đơn mới, Số đơn đang xử lý.
        3) Hệ thống hiển thị biểu đồ doanh thu 7 ngày gần nhất.
        4) Hệ thống hiển thị danh sách 5 đơn hàng mới nhất.
    - **3.2 Luồng điều chỉnh trạng thái cửa hàng**:
        1) Chủ nhà hàng gạt nút Toggle "Trạng thái cửa hàng".
        2) Hệ thống yêu cầu xác nhận.
        3) Nếu xác nhận mở: Quán xuất hiện trên App khách hàng. Nếu xác nhận đóng: Khách không thể đặt món.
4. **Các yêu cầu đặc biệt**: Doanh thu hiển thị là doanh thu thực nhận (thường là 95% sau khi trừ phí hệ thống/shipper).
5. **Tiền điều kiện**: Chủ nhà hàng đã đăng nhập và đã được gán nhà hàng.
6. **Hậu điều kiện**: Trạng thái quán được cập nhật trên toàn hệ thống.
7. **Điểm mở rộng**: Không có.

## 2.5.2 Mô tả use case: Quản lý thực đơn (Merchant Menu Management)
1. **Tên Use Case**: Quản lý thực đơn nhà hàng.
2. **Mô tả vắn tắt**: Cho phép Chủ nhà hàng tự quản lý danh sách món ăn, giá cả và hình ảnh của quán mình.
3. **Luồng các sự kiện**:
    - **3.1 Luồng thêm/Sửa món ăn**:
        1) Chủ nhà hàng nhấn "Thêm món mới" hoặc "Sửa".
        2) Nhập: Tên món, Giá, Danh mục, Mô tả và Tải ảnh.
        3) Nhấn "Lưu". Hệ thống kiểm tra dữ liệu và cập nhật.
    - **3.2 Luồng thay đổi trạng thái món ăn (Bật/Tắt bán)**:
        1) Chủ nhà hàng dùng nút Toggle trên thẻ món ăn để báo "Hết hàng" (Unavailable) hoặc "Còn hàng" (Available).
    - **3.3 Luồng xóa món**:
        1) Chủ nhà hàng nhấn "Xóa" và xác nhận để gỡ món ăn khỏi thực đơn.
4. **Các yêu cầu đặc biệt**: Chủ nhà hàng chỉ có quyền quản lý sản phẩm thuộc nhà hàng của mình (Phân quyền Role Merchant).
5. **Tiền điều kiện**: Đã đăng nhập Role MERCHANT.
6. **Hậu điều kiện**: Thực đơn được cập nhật.
7. **Điểm mở rộng**: Không có.

## 2.5.3 Mô tả use case: Quy trình xử lý đơn hàng (Order Processing)
1. **Tên Use Case**: Quy trình tiếp nhận và xử lý đơn hàng.
2. **Mô tả vắn tắt**: Chủ nhà hàng tiếp nhận đơn hàng từ khách, chuẩn bị món và báo cho hệ thống để shipper đến lấy.
3. **Luồng các sự kiện**:
    - **3.1 Luồng tiếp nhận đơn**:
        1) Đơn hàng mới xuất hiện ở tab "Chờ duyệt" (PENDING).
        2) Chủ nhà hàng xem chi tiết và nhấn "Xác nhận" (Confirm).
        3) Trạng thái chuyển sang "Đã xác nhận" (CONFIRMED).
    - **3.2 Luồng chuẩn bị món xong**:
        1) Khi món ăn đã sẵn sàng, Chủ nhà hàng nhấn "Báo món sẵn sàng" (Mark Ready).
        2) Trạng thái chuyển sang "Sẵn sàng" (READY_FOR_PICKUP). Hệ thống sẽ thông báo cho Shipper.
    - **3.3 Luồng từ chối đơn**:
        1) Nếu không thể phục vụ, Chủ nhà hàng nhấn "Từ chối".
        2) Nhập lý do (ví dụ: Hết nguyên liệu).
        3) Hệ thống hủy đơn và thông báo cho khách hàng.
4. **Các yêu cầu đặc biệt**: Quy trình chuyển trạng thái phải tuân thủ đúng trình tự (Pending -> Confirmed -> Ready).
5. **Tiền điều kiện**: Có đơn hàng mới được đặt tới nhà hàng.
6. **Hậu điều kiện**: Shipper nhận được thông báo để tới lấy hàng.
7. **Điểm mở rộng**: Không có.

## 2.5.4 Mô tả use case: Cài đặt thông tin nhà hàng (Restaurant Settings)
1. **Tên Use Case**: Cài đặt thông tin và thời gian hoạt động.
2. **Mô tả vắn tắt**: Chủ nhà hàng cập nhật thông tin liên hệ và lịch mở cửa định kỳ trong tuần.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cập nhật thông tin**:
        1) Chủ nhà hàng sửa Số điện thoại, Địa chỉ. (Lưu ý: Tên nhà hàng thường do Admin quản lý nên có thể để Read-only).
    - **3.2 Luồng thiết lập giờ mở cửa (Schedule)**:
        1) Chủ nhà hàng tick chọn các ngày trong tuần quán mở cửa.
        2) Thiết lập Giờ mở và Giờ đóng cho từng ngày.
        3) Nhấn "Lưu cài đặt".
4. **Các yêu cầu đặc biệt**: Giờ đóng cửa phải sau giờ mở cửa.
5. **Tiền điều kiện**: Admin đã gán quyền quản lý nhà hàng cho User.
6. **Hậu điều kiện**: Thời gian hiển thị "Đang mở cửa/Đóng cửa" trên App khách hàng sẽ tự động cập nhật theo lịch.
7. **Điểm mở rộng**: Không có.

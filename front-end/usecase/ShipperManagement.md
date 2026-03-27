# Tài liệu Use Case: Quản lý Shipper (Shipper Management)

## 2.6.1 Mô tả use case: Theo dõi hiệu suất và ví hoa hồng (Shipper Dashboard)
1. **Tên Use Case**: Theo dõi hiệu suất và ví hoa hồng.
2. **Mô tả vắn tắt**: Cho phép Shipper xem thu nhập từ hoa hồng, số dư ví và trạng thái đơn hàng đang thực hiện ngay khi vào ứng dụng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Shipper truy cập Dashboard.
        2) Hệ thống hiển thị: Tổng đơn, Đơn thành công, Doanh thu hoa hồng (5% giá trị đơn), Số đơn giao hôm nay.
        3) Hệ thống hiển thị "Ví hoa hồng" với số dư hiện tại.
        4) Nếu có đơn hàng đang giao, hệ thống hiển thị "Banner Đơn hàng đang thực hiện" để truy cập nhanh.
        5) Hệ thống hiển thị biểu đồ cột thống kê khối lượng giao hàng theo tuần.
4. **Các yêu cầu đặc biệt**: Doanh thu của Shipper được tính là 5% tổng giá trị đơn hàng (theo logic chia sẻ 95/5).
5. **Tiền điều kiện**: User đăng nhập với Role SHIPPER.
6. **Hậu điều kiện**: Shipper nắm bắt được tình hình thu nhập.
7. **Điểm mở rộng**: Nhấn vào Banner đơn hàng để đi tới trang Chi tiết đơn.

## 2.6.2 Mô tả use case: Nhận và Quản lý đơn hàng (Order Management for Shipper)
1. **Tên Use Case**: Nhận và Quản lý danh sách đơn hàng.
2. **Mô tả vắn tắt**: Shipper tìm kiếm đơn hàng mới sẵn sàng để giao và quản lý các đơn mình đã nhận.
3. **Luồng các sự kiện**:
    - **3.1 Luồng nhận đơn mới**:
        1) Shipper vào tab "Chờ nhận" (PENDING).
        2) Hệ thống hiển thị các đơn hàng ở trạng thái READY_FOR_PICKUP chưa có người nhận.
        3) Shipper nhấn "Nhận đơn".
        4) Hệ thống gán Shipper cho đơn hàng và chuyển đơn sang tab "Đang giao".
    - **3.2 Luồng quản lý danh sách**:
        1) Shipper chuyển đổi giữa các tab: Chờ nhận, Đang giao, Đã giao, Thất bại để theo dõi lịch sử.
        2) Trong mỗi tab, Shipper có thể xem nhanh thông tin: Mã đơn, Thời gian, Tên khách, Địa chỉ và Tổng tiền.
4. **Các yêu cầu đặc biệt**: Tính năng "Nhận đơn" chỉ khả dụng khi đơn hàng chưa có shipper gán (assigned=false).
5. **Tiền điều kiện**: Shipper đang ở trạng thái Online.
6. **Hậu điều kiện**: Đơn hàng được gán cho Shipper và chuyển vào quy trình giao hàng.

## 2.6.3 Mô tả use case: Quy trình Giao hàng (Delivery Execution)
1. **Tên Use Case**: Quy trình Thực hiện Giao hàng.
2. **Mô tả vắn tắt**: Các bước từ khi Shipper lấy hàng tại quán đến khi giao tận tay khách hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng Lấy hàng (Picked Up)**:
        1) Shipper đến Nhà hàng, nhấn "Xác nhận Lấy hàng" (Picked up).
        2) Trạng thái đơn chuyển sang DELIVERING.
    - **3.2 Luồng Giao hàng thành công (Delivered)**:
        1) Shipper đến địa chỉ khách hàng.
        2) Shipper có thể dùng tính năng "Gọi điện" hoặc "Chỉ đường" trên giao diện.
        3) Sau khi khách nhận hàng, Shipper nhấn "Xác nhận Giao hàng" (Delivered).
        4) Hệ thống cập nhật trạng thái COMPLETED, thực hiện chia tiền hoa hồng và tự động quay lại danh sách sau 5 giây.
    - **3.3 Luồng Giao hàng thất bại (Delivery Failed)**:
        1) Nếu không thể giao (Khách không nghe máy, sai địa chỉ...), Shipper nhấn "Thất bại".
        2) Chọn lý do từ danh sách và nhập ghi chú chi tiết.
        3) Nhấn "Yêu cầu Hủy". Hệ thống cập nhật trạng thái DELIVERY_FAILED.
4. **Các yêu cầu đặc biệt**: Nút "Gọi điện" và "Chỉ đường" tích hợp với ứng dụng gốc của điện thoại.
5. **Tiền điều kiện**: Đơn hàng đã được Shipper nhận thành công.
6. **Hậu điều kiện**: Đơn hàng kết thúc vòng đời (Thành công hoặc Thất bại).

## 2.6.4 Mô tả use case: Quản lý hồ sơ và Trạng thái làm việc (Shipper Profile & Status)
1. **Tên Use Case**: Quản lý hồ sơ và Trạng thái làm việc.
2. **Mô tả vắn tắt**: Shipper bật/tắt chế độ nhận đơn và cập nhật thông tin cá nhân/phương tiện.
3. **Luồng các sự kiện**:
    - **3.1 Luồng Toggle Online/Offline**:
        1) Shipper gạt nút "Trạng thái".
        2) Nếu Online: Có thể nhận đơn mới. Nếu Offline: Tạm ngừng nhận đơn.
    - **3.2 Luồng cập nhật thông tin**:
        1) Shipper thay đổi Ảnh đại diện, Họ tên, SĐT, Email.
        2) Shipper cập nhật Loại xe (Xe máy, Xe tải...) và Biển số xe.
        3) Nhấn "Cập nhật thông tin" để lưu.
4. **Các yêu cầu đặc biệt**: Thông tin biển số xe quan trọng để khách hàng nhận diện shipper.
5. **Tiền điều kiện**: Đã đăng nhập.
6. **Hậu điều kiện**: Thông tin cá nhân được cập nhật.

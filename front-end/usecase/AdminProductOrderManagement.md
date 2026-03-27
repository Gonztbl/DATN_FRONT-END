# Tài liệu Use Case: Quản lý Sản phẩm và Đơn hàng (Admin Product & Order Management)

## 2.4.1 Mô tả use case: Quản lý danh mục món ăn (Products)
1. **Tên Use Case**: Quản lý danh mục món ăn toàn hệ thống.
2. **Mô tả vắn tắt**: Cho phép Admin quản lý thực đơn của tất cả các nhà hàng, bao gồm việc thêm mới, chỉnh sửa thông tin, giá cả và trạng thái kinh doanh.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản (Xem và Lọc)**:
        1) Admin truy cập "Product Management".
        2) Hệ thống hiển thị danh sách món ăn kèm các thông tin: Tên, Danh mục, Nhà hàng, Giá, Đánh giá, Trạng thái.
        3) Admin có thể lọc theo: Tên món (Search), Danh mục (Category), Nhà hàng (Restaurant).
    - **3.2 Luồng thêm món ăn mới**:
        1) Admin nhấn "Thêm món mới".
        2) Admin nhập: Tên món, Mô tả, Giá bán, Chọn Danh mục, Chọn Nhà hàng.
        3) Admin tải lên hình ảnh món ăn (Hệ thống chuyển đổi sang Base64 để lưu trữ).
        4) Admin chọn trạng thái khởi tạo (Available/Unavailable).
        5) Hệ thống lưu và thông báo thành công.
    - **3.3 Luồng chỉnh sửa**:
        1) Admin nhấn biểu tượng "Sửa" tại dòng món ăn.
        2) Hệ thống mở Modal hiển thị thông tin hiện tại.
        3) Admin thay đổi thông tin và nhấn "Lưu thay đổi".
    - **3.4 Luồng thay đổi trạng thái nhanh (Toggle Status)**:
        1) Admin nhấn vào công tắc (Toggle) tại cột Trạng thái.
        2) Hệ thống ngay lập tức cập nhật trạng thái món ăn (Available/Unavailable) mà không cần mở Modal.
    - **3.5 Các luồng rẽ nhánh**:
        1) Nếu thiếu thông tin bắt buộc: Hệ thống báo "Vui lòng điền đầy đủ thông tin bắt buộc!".
        2) Nếu ảnh quá lớn (>2MB): Hệ thống báo "Kích thước ảnh không được vượt quá 2MB".
4. **Các yêu cầu đặc biệt**: Giá bán phải là số dương. Ảnh được xử lý render an toàn từ các định dạng URL hoặc Base64.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Dữ liệu thực đơn được cập nhật và hiển thị đúng cho khách hàng.
7. **Điểm mở rộng**: Không có.

## 2.4.2 Mô tả use case: Quản lý đơn hàng (Order Management)
1. **Tên Use Case**: Quản lý đơn hàng toàn hệ thống.
2. **Mô tả vắn tắt**: Cho phép Admin theo dõi tất cả các giao dịch đặt hàng, lọc theo trạng thái, đối tác vận chuyển hoặc nhà hàng để quản lý vận hành.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập "Quản lý đơn hàng".
        2) Hệ thống hiển thị danh sách đơn hàng mới nhất.
        3) Admin sử dụng bộ lọc nâng cao: Trạng thái (Pending, Confirmed, Delivering...), Nhà hàng cụ thể, Shipper cụ thể, hoặc theo Khoảng ngày.
        4) Admin có thể tìm kiếm theo Mã đơn, Tên khách hàng hoặc SĐT.
    - **3.2 Luồng xem chi tiết**:
        1) Admin nhấn biểu tượng "Xem" (Visibility) tại một đơn hàng.
        2) Hệ thống chuyển đến trang Chi tiết đơn hàng.
    - **3.3 Luồng xóa đơn hàng**:
        1) Admin nhấn "Xóa" tại một đơn hàng không hợp lệ hoặc đơn ảo.
        2) Hệ thống yêu cầu xác nhận. Nếu đồng ý, đơn hàng được gỡ khỏi hệ thống.
4. **Các yêu cầu đặc biệt**: Thông tin Khách hàng được bảo mật nhưng hiển thị đủ SĐT/Địa chỉ để hỗ trợ xử lý khi có sự cố.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Trạng thái đơn hàng được kiểm soát.
7. **Điểm mở rộng**: Không có.

## 2.4.3 Mô tả use case: Xử lý và Hủy đơn hàng (Order Processing & Cancellation)
1. **Tên Use Case**: Xử lý và Hủy đơn hàng.
2. **Mô tả vắn tắt**: Cho phép Admin can thiệp vào quy trình xử lý đơn hàng (thay đổi trạng thái thủ công) hoặc hủy đơn hàng nếu có sự cố nghiêm trọng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cập nhật trạng thái đơn (Manual Override)**:
        1) Tại trang Chi tiết đơn hàng, Admin chọn trạng thái mới từ Menu (ví dụ: Chuyển từ PENDING sang CONFIRMED).
        2) Admin nhấn "Lưu thay đổi".
        3) Hệ thống cập nhật trạng thái và ghi nhận vào Lịch trình đơn hàng (Status History).
    - **3.2 Luồng hủy đơn hàng và hoàn tiền**:
        1) Admin chọn lý do hủy đơn từ danh sách (Hết hàng, Khách yêu cầu, Sự cố vận hành...).
        2) Admin nhấn "Xác nhận hủy đơn hàng".
        3) Hệ thống gọi API hủy đơn.
        4) **Đặc biệt**: Nếu đơn hàng đã thanh toán qua ví, hệ thống sẽ thực hiện giao dịch hoàn tiền tự động và thông báo mã giao dịch hoàn tiền (Refund Transaction ID).
    - **3.3 Luồng theo dõi lịch trình (Timeline)**:
        1) Hệ thống hiển thị dòng thời gian (Timeline) ghi lại mọi thay đổi trạng thái kèm thời gian thực và người thực hiện.
4. **Các yêu cầu đặc biệt**: Tính năng hủy đơn yêu cầu lý do bắt buộc. Giao dịch hoàn tiền phải được đảm bảo tính nhất quán dữ liệu.
5. **Tiền điều kiện**: Đơn hàng đang ở trạng thái cho phép xử lý (không phải đã hoàn thành hoặc đã hủy trước đó).
6. **Hậu điều kiện**: Trạng thái đơn hàng được cập nhật, tiền được hoàn trả cho khách nếu có.
7. **Điểm mở rộng**: Không có.

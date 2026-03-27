# Tài liệu Use Case: Quản lý đối tác Nhà hàng và Danh mục (Admin Restaurant & Category Management)

## 2.3.1 Mô tả use case: Quản lý nhà hàng đối tác
1. **Tên Use Case**: Quản lý nhà hàng đối tác.
2. **Mô tả vắn tắt**: Cho phép Admin thêm, sửa, xóa và theo dõi trạng thái hoạt động của các nhà hàng trong hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản (Xem và Lọc)**:
        1) Admin truy cập "Restaurant Management".
        2) Hệ thống hiển thị danh sách nhà hàng kèm bộ lọc: Theo tên, địa chỉ hoặc trạng thái (Mở/Đóng).
        3) Admin có thể nhấn "Xuất dữ liệu" để tải về file CSV danh sách nhà hàng.
    - **3.2 Luồng thêm mới**:
        1) Admin nhấn "Thêm nhà hàng".
        2) Admin nhập: Tên, SĐT, Email, Địa chỉ, Giờ mở/đóng cửa và Chọn chủ nhà hàng (từ danh sách RESTAURANT_OWNER).
        3) Hệ thống kiểm tra trùng tên nhà hàng.
        4) Nếu hợp lệ, hệ thống lưu và thông báo thành công.
    - **3.3 Luồng chỉnh sửa**:
        1) Admin nhấn biểu tượng "Edit" tại một nhà hàng.
        2) Hệ thống hiển thị Modal chứa thông tin cũ.
        3) Admin sửa thông tin và nhấn "Lưu".
    - **3.4 Luồng xóa**:
        1) Admin nhấn biểu tượng "Delete".
        2) Hệ thống hiển thị xác nhận. Nếu Admin đồng ý, hệ thống gọi API xóa.
    - **3.5 Các luồng rẽ nhánh**:
        1) Nếu xóa nhà hàng đang có sản phẩm: Hệ thống báo lỗi "Không thể xóa nhà hàng. Có thể nhà hàng này đang chứa sản phẩm."
        2) Nếu trùng tên nhà hàng: Hệ thống báo "Tên nhà hàng ... đã tồn tại!"
4. **Các yêu cầu đặc biệt**: Chủ nhà hàng phải được chọn từ danh sách người dùng có vai trò `RESTAURANT_OWNER`.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Thông tin nhà hàng được cập nhật.
7. **Điểm mở rộng**: Không có.

## 2.3.2 Mô tả use case: Quản lý danh mục sản phẩm (Category)
1. **Tên Use Case**: Quản lý danh mục sản phẩm.
2. **Mô tả vắn tắt**: Cho phép Admin định nghĩa các loại hình dịch vụ hoặc nhóm sản phẩm (như Đồ ăn, Đồ uống, Đồ gia dụng...) để phân loại trên App khách hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập "Category Management".
        2) Hệ thống hiển thị bảng danh sách: Biểu tượng (Icon), Tên danh mục, Thứ tự hiển thị, Số lượng sản phẩm liên kết.
        3) Admin có thể tìm kiếm theo tên hoặc mã danh mục.
    - **3.2 Luồng thêm/sửa danh mục**:
        1) Admin nhấn "Thêm danh mục" hoặc "Sửa".
        2) Admin nhập Tên, chọn Biểu tượng từ bộ sưu tập có sẵn và nhập Thứ tự hiển thị.
        3) Hệ thống kiểm tra trùng tên danh mục.
        4) Admin nhấn "Lưu".
    - **3.3 Luồng xóa**:
        1) Admin nhấn "Xóa" và xác nhận.
        2) Hệ thống xóa danh mục khỏi cơ sở dữ liệu.
    - **3.4 Các luồng rẽ nhánh**:
        1) Nếu danh mục đang có sản phẩm: Hệ thống ngăn chặn việc xóa và báo lỗi.
4. **Các yêu cầu đặc biệt**: Biểu tượng được chọn từ bộ icon chuẩn (Material Symbols).
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Cấu trúc danh mục hệ thống được cập nhật.
7. **Điểm mở rộng**: Không có.

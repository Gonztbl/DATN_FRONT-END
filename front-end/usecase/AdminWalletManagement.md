# Tài liệu Use Case: Quản lý Ví và Giao dịch (Admin Wallet & Transaction Management)

## 2.2.1 Mô tả use case: Xem danh sách ví điện tử
1. **Tên Use Case**: Xem danh sách ví điện tử.
2. **Mô tả vắn tắt**: Cho phép Admin xem danh sách tất cả các ví điện tử trong hệ thống kèm số dư và trạng thái.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập menu "Wallet Management".
        2) Hệ thống gọi API `getAllWallets` để lấy dữ liệu (tối đa 1000 bản ghi để phục vụ lọc tại client).
        3) Hệ thống hiển thị bảng gồm: ID, Account Number, User ID, Balance (VND), Status, Created At.
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu lỗi tải dữ liệu: Hệ thống hiển thị thông báo "Failed to load wallets."
4. **Các yêu cầu đặc biệt**: Số dư phải được định dạng theo tiền tệ VND (ví dụ: 1.000.000 ₫).
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

## 2.2.2 Mô tả use case: Nạp tiền vào ví (Admin Topup)
1. **Tên Use Case**: Nạp tiền vào ví (Admin Topup).
2. **Mô tả vắn tắt**: Cho phép Admin cộng tiền trực tiếp vào ví của người dùng trong các trường hợp đặc biệt (khuyến mãi, hoàn tiền thủ công...).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin chọn một ví trong danh sách và kích nút "Topup".
        2) Hệ thống hiển thị Modal "Topup Wallet" kèm thông tin ví hiện tại.
        3) Admin nhập số tiền cần nạp.
        4) Admin kích nút "Topup" trong modal.
        5) Hệ thống gọi API `adminTopupWallet`.
        6) Hệ thống hiển thị thông báo thành công kèm chi tiết: Số tiền đã nạp, Số dư trước và sau khi nạp.
        7) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu Admin nhập số tiền nhỏ hơn hoặc bằng 0: Hệ thống báo lỗi "Please enter a valid amount greater than 0".
        2) Nếu API phản hồi lỗi: Hệ thống hiển thị Modal thông báo thất bại kèm lý do lỗi từ Server.
4. **Các yêu cầu đặc biệt**: Cung cấp các nút chọn nhanh số tiền (100k, 500k, 1M).
5. **Tiền điều kiện**: Ví mục tiêu đang ở trạng thái ACTIVE.
6. **Hậu điều kiện**: Số dư khả dụng của ví được cập nhật tăng lên.
7. **Điểm mở rộng**: Không có.

## 2.2.3 Mô tả use case: Khóa/Mở khóa ví
1. **Tên Use Case**: Khóa/Mở khóa ví.
2. **Mô tả vắn tắt**: Cho phép Admin đóng băng hoặc kích hoạt lại một ví điện tử.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích vào nút Toggle tại hàng tương ứng của ví.
        2) Hệ thống xác định: Nếu ví đang ACTIVE thì gọi `lockWallet`, nếu đang LOCKED/FROZEN thì gọi `unlockWallet`.
        3) Hệ thống cập nhật trạng thái mới trên bảng.
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu lỗi: Hệ thống báo "Failed to update wallet status. Please try again."
4. **Các yêu cầu đặc biệt**: Không có.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Trạng thái ví được cập nhật trong DB.
7. **Điểm mở rộng**: Không có.

## 2.2.4 Mô tả use case: Xem lịch sử giao dịch hệ thống
1. **Tên Use Case**: Xem lịch sử giao dịch hệ thống.
2. **Mô tả vắn tắt**: Cho phép Admin theo dõi tất cả các luồng tiền (Nạp, Rút, Chuyển) của toàn bộ người dùng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập menu "Transaction History".
        2) Hệ thống gọi API `getAllAdminTransactions`.
        3) Hệ thống sắp xếp giao dịch mới nhất lên đầu và hiển thị trong bảng.
        4) Admin có thể tìm kiếm theo Transaction ID hoặc Wallet ID.
        5) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu không có kết nối: Hệ thống báo "Failed to load transactions."
4. **Các yêu cầu đặc biệt**: Phân biệt màu sắc cho số tiền (Xanh cho tiền vào, Đỏ cho tiền ra).
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

## 2.2.5 Mô tả use case: Xem chi tiết giao dịch
1. **Tên Use Case**: Xem chi tiết giao dịch.
2. **Mô tả vắn tắt**: Xem thông tin đối tác, ghi chú và mã tham chiếu của một giao dịch cụ thể.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích nút "View" tại một hàng giao dịch.
        2) Hệ thống hiển thị Modal "Transaction Details" gồm: ID, Reference ID, Wallet ID, User ID, Type, Direction, Partner Name, Note, Created At và kết quả (Success/Fail).
        3) Admin xem xong và kích "Close".
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**: Không có.
4. **Các yêu cầu đặc biệt**: Hiển thị Note (Ghi chú) đầy đủ trong khung riêng.
5. **Tiền điều kiện**: Admin đang ở trang lịch sử giao dịch.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

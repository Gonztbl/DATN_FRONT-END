# Tài liệu Use Case: TransferHistoryPage

## 1. Thông tin chung
- **Tên màn hình**: Chuyển tiền và Lịch sử giao dịch (Transfer & History)
- **File**: `TransferHistoryPage.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Giao diện toàn diện để thực hiện chuyển tiền P2P (Peer-to-Peer), quản lý mã QR cá nhận và tra cứu chi tiết biến động số dư.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-THP-01: Chuyển tiền P2P (Send Money)
- **Tìm kiếm người nhận**: Nhập số điện thoại để tìm kiếm ví đích.
- Hiển thị thông tin người nhận (Tên, Ảnh đại diện, 4 số cuối ví) để xác nhận trước khi chuyển.
- Nhập số tiền và ghi chú cá nhân.

### UC-THP-02: Nhận tiền qua mã QR (Receive Money)
- Hiển thị mã QR cá nhân đại diện cho ví của người dùng.
- Hỗ trợ sao chép nhanh số tài khoản ví (Copy to clipboard).
- Cho phép người khác quét mã để thực hiện chuyển tiền tức thì.

### UC-THP-03: Bộ lọc Lịch sử giao dịch
- Lọc theo thời gian: 30 ngày qua, 3 tháng qua, hoặc trong năm nay.
- Lọc theo loại giao dịch: Tất cả, Tiền gửi (Received), Tiền gửi đi (Sent).
- Phân trang (Pagination) dữ liệu để tối ưu tốc độ tải.

### UC-THP-04: Danh sách biến động số dư (Transaction List)
- Hiển thị bảng chi tiết: Ngày giờ, Đối tác giao dịch, Loại (Gửi/Nhận), Số tiền (màu đỏ cho - / màu xanh cho +), Trạng thái, và Ghi chú.
- Click vào từng dòng để xem chi tiết chuyên sâu của giao dịch đó.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Chuyển tiền nội bộ (P2P Transfer)
1. **Tên Use Case**: Chuyển tiền qua SĐT.
2. **Mô tả vắn tắt**: Người dùng tìm kiếm và chuyển tiền cho người dùng khác trong hệ thống SmartPay.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng nhập SĐT người nhận vào ô tìm kiếm.
        2) Hệ thống xác thực SĐT và hiển thị thông tin người nhận (Tên, Ảnh). [A1]
        3) Người dùng nhập số tiền và nội dung chuyển khoản.
        4) Nhấn "Send Now" và xác nhận giao dịch.
        5) Hệ thống kiểm tra số dư ví người gửi. [A2]
        6) Hệ thống thực hiện trừ tiền người gửi, cộng tiền người nhận và thông báo thành công.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không tìm thấy người dùng**: Nếu SĐT không tồn tại trên hệ thống, hiển thị thông báo "User not found".
        2) **[A2] Số dư không đủ**: Nếu số tiền chuyển vượt quá số dư ví, hiển thị thông báo lỗi và không cho phép thực hiện.
4. **Tiền điều kiện**: Đăng nhập thành công và có số dư ví khả dụng.
5. **Hậu điều kiện**: Tiền được chuyển tức thì, cả hai bên đều nhận được thông báo biến động số dư.

### 4.2 Mô tả usecase Tra cứu lịch sử giao dịch
1. **Tên Use Case**: Xem lịch sử biến động số dư.
2. **Mô tả vắn tắt**: Người dùng xem danh sách các giao dịch đã thực hiện để đối soát tài chính.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Hệ thống tự động tải danh sách giao dịch gần nhất khi truy cập trang.
        2) Người dùng chọn bộ lọc Thời gian hoặc Loại giao dịch (Gửi/Nhận).
        3) Hệ thống hiển thị danh sách giao dịch tương ứng.
        4) Người dùng nhấn vào một giao dịch cụ thể để xem chi tiết (Mã GD, Thời gian, Trạng thái, Nội dung).
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Không có.

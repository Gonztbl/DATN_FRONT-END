# Tài liệu Use Case: Ví điện tử và Tài chính (Wallet & Finance)

## 2.7.1 Mô tả use case: Quản lý số dư và Thống kê (Wallet Dashboard)
1. **Tên Use Case**: Theo dõi số dư và Phân tích chi tiêu.
2. **Mô tả vắn tắt**: Cung cấp cái nhìn tổng quan về tình hình tài chính cá nhân, bao gồm số dư, biến động thu chi và biểu đồ trực quan.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang chủ Ví (Dashboard).
        2) Hệ thống hiển thị: Số dư khả dụng, Tổng Thu (Income), Tổng Chi (Expense).
        3) Hệ thống hiển thị Biểu đồ chi tiêu (Spending Analytics) của 7 ngày hoặc 30 ngày gần nhất.
        4) Hiển thị 5 giao dịch gần đây nhất để người dùng theo dõi nhanh.
4. **Các yêu cầu đặc biệt**: Dữ liệu biểu đồ phải được cập nhật ngay sau khi có giao dịch mới thành công.
5. **Tiền điều kiện**: Đã đăng nhập và có ví được kích hoạt.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Nhấn "View All" để sang trang Lịch sử chi tiết.

## 2.7.2 Mô tả use case: Nạp tiền vào ví (Deposit)
1. **Tên Use Case**: Nạp tiền từ nguồn bên ngoài.
2. **Mô tả vắn tắt**: Cho phép người dùng chuyển tiền từ thẻ ngân hàng đã liên kết vào số dư ví điện tử.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng chọn chức năng "Top Up" hoặc "Deposit".
        2) Chọn thẻ ngân hàng trong danh sách đã liên kết.
        3) Nhập số tiền (hoặc chọn các mức nạp nhanh như 50k, 100k, 500k).
        4) Nhấn "Confirm Deposit". 
        5) Hệ thống kiểm tra số dư thẻ, thực hiện trừ tiền thẻ và cộng tiền vào ví.
4. **Các yêu cầu đặc biệt**: Số dư thẻ phải đủ để thực hiện giao dịch.
5. **Tiền điều kiện**: Có ít nhất một thẻ ngân hàng được liên kết thành công.
6. **Hậu điều kiện**: Số dư ví tăng lên, hệ thống ghi nhận giao dịch loại DEPOSIT.

## 2.7.3 Mô tả use case: Rút tiền (Withdraw)
1. **Tên Use Case**: Rút tiền về tài khoản ngân hàng.
2. **Mô tả vắn tắt**: Người dùng rút tiền từ số dư ví về tài khoản ngân hàng cá nhân.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng chọn "Withdraw".
        2) Chọn tài khoản/thẻ ngân hàng muốn nhận tiền.
        3) Nhập số tiền cần rút.
        4) Hệ thống hiển thị phí dịch vụ (ví dụ: 0.5%) và tổng số tiền sẽ bị trừ.
        5) Nhấn "Confirm Withdraw".
        6) Hệ thống trừ tiền ví và tạo lệnh chuyển tiền về ngân hàng.
4. **Các yêu cầu đặc biệt**: Số tiền rút cộng với phí phải nhỏ hơn hoặc bằng số dư khả dụng.
5. **Tiền điều kiện**: Có số dư ví > 0.
6. **Hậu điều kiện**: Số dư ví giảm, trạng thái giao dịch được ghi nhận (thường là PENDING trong lúc chờ ngân hàng xử lý).

## 2.7.4 Mô tả use case: Chuyển tiền (Transfer Money)
1. **Tên Use Case**: Chuyển tiền nội bộ hệ thống.
2. **Mô tả vắn tắt**: Chuyển tiền nhanh chóng cho người dùng khác trong cùng hệ thống qua SĐT hoặc Quét mã.
3. **Luồng các sự kiện**:
    - **3.1 Luồng chuyển qua SĐT**:
        1) Người dùng nhập SĐT người nhận.
        2) Hệ thống tìm kiếm và hiển thị tên người nhận để xác nhận.
        3) Nhập số tiền và nội dung (tùy chọn).
        4) Nhấn "Send Now" và xác nhận.
    - **3.2 Luồng quét mã QR**:
        1) Người dùng chọn "Scan QR". 
        2) Quét mã QR của người nhận (hoặc tải ảnh QR từ máy).
        3) Hệ thống tự điền thông tin người nhận (và số tiền nếu mã QR có kèm tiền).
        4) Xác nhận chuyển tiền.
4. **Các yêu cầu đặc biệt**: Giao dịch chuyển tiền nội bộ diễn ra tức thời (Real-time).
5. **Tiền điều kiện**: Người nhận phải có tài khoản trên hệ thống.
6. **Hậu điều kiện**: Tiền được chuyển từ ví người gửi sang ví người nhận ngay lập tức.

## 2.7.5 Mô tả use case: Nhận tiền và Yêu cầu thanh toán (Receive & Request)
1. **Tên Use Case**: Nhận tiền qua mã QR.
2. **Mô tả vắn tắt**: Cung cấp mã định danh ví dưới dạng QR để người khác chuyển tiền dễ dàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng hiển thị mã cố định**:
        1) Người dùng vào trang "Receive Money".
        2) Hệ thống hiển thị mã QR cá nhân và Số tài khoản ví.
        3) Người dùng có thể lưu ảnh (Save Image) hoặc chia sẻ (Share) mã này.
    - **3.2 Luồng tạo mã kèm số tiền (Set Amount)**:
        1) Nhấn "Set Amount". Nhập số tiền cụ thể (ví dụ: 100k).
        2) Hệ thống tạo lại mã QR có nhúng thông tin số tiền.
        3) Khi người khác quét mã này, số tiền sẽ tự động được điền.
4. **Các yêu cầu đặc biệt**: Mã QR phải tuân thủ định dạng của hệ thống để đảm bảo tính bảo mật.
5. **Tiền điều kiện**: Không có.
6. **Hậu điều kiện**: Nhận được tiền vào ví sau khi người gửi thực hiện quét và xác nhận.

## 2.7.6 Mô tả use case: Tra cứu lịch sử giao dịch (Transaction History)
1. **Tên Use Case**: Tra cứu lịch sử giao dịch.
2. **Mô tả vắn tắt**: Xem lại toàn bộ danh sách các biến động số dư đã thực hiện.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào trang "History".
        2) Hệ thống hiển thị danh sách giao dịch phân trang.
        3) Người dùng có thể lọc theo: Thời gian (30 ngày, 3 tháng, 1 năm), Loại (Gửi - OUT, Nhận - IN).
        4) Mỗi giao dịch hiển thị: Ngày giờ, Tên đối tác, Loại, Số tiền, Trạng thái (COMPLETED, PENDING, FAILED).
        5) Nhấn vào một giao dịch để xem biên lai chi tiết.
4. **Các yêu cầu đặc biệt**: Lịch sử phải hiển thị chính xác thời gian và mã tham chiếu giao dịch.
5. **Tiền điều kiện**: Không có.
6. **Hậu điều kiện**: Không có.

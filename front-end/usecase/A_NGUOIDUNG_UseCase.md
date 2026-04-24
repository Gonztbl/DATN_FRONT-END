

--- START FILE: DashboardPage.md ---

# Tài liệu Use Case: Wallet Dashboard

## 1. Thông tin chung
- **Tên màn hình**: Bảng điều khiển Ví (Wallet Dashboard)
- **File**: `DashboardPage.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Giao diện trung tâm hiển thị tình trạng tài chính, quản lý thẻ liên kết và thực hiện các giao dịch nhanh.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-WD-01: Hiển thị Tổng số dư (Balance Overview)
- Hiển thị số dư khả dụng một cách nổi bật.
- Thống kê Tổng thu (Income) và Tổng chi (Expense) trong tháng.
- Hiển thị phần trăm thay đổi số dư so với tháng trước.

### UC-WD-02: Phân tích chi tiêu (Spending Analytics)
- Biểu đồ cột hiển thị xu hướng chi tiêu trong 7 ngày gần nhất.
- Hỗ trợ xem chi tiết số tiền khi di chuột (Hover tooltip) vào từng cột ngày.

### UC-WD-03: Quản lý Thẻ liên kết (Card Management)
- Hiển thị danh sách các thẻ ngân hàng đã liên kết (Số thẻ ẩn, Tên ngân hàng, Loại thẻ).
- Cho phép thêm thẻ mới (Add Card Modal) với các trường: Số thẻ, Tên chủ thẻ, Ngày hết hạn, CVV.

### UC-WD-04: Giao dịch nhanh (Quick Actions)
- **Nạp tiền nhanh (Top-up)**: Nạp tiền từ thẻ đã chọn vào ví.
- **Chuyển tiền nhanh (P2P Transfer)**: 
    - Tìm kiếm người nhận theo số điện thoại.
    - Quét mã QR để tự động điền thông tin người nhận.
    - Hiển thị danh sách liên lạc thường xuyên (Frequent Contacts).

### UC-WD-05: Thông báo giao dịch (Live Notifications)
- Hiển thị danh sách các giao dịch nhận tiền mới nhất trong menu thông báo (Bell icon).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý số dư và Thống kê (Dashboard)
1. **Tên Use Case**: Theo dõi tài chính cá nhân.
2. **Mô tả vắn tắt**: Người dùng xem tổng quan số dư, thu chi và biểu đồ phân tích để quản lý tiền tệ.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập Dashboard Ví.
        2) Hệ thống tải song song: Số dư, Thẻ liên kết, Lịch sử 7 ngày.
        3) Hệ thống hiển thị biểu đồ chi tiêu (Chart).
        4) Người dùng có thể nhấn vào biểu tượng "Mắt" để ẩn/hiện số dư thực tế.
        5) Người dùng nhấn vào các nút Quick Actions (Topup, Transfer) để thực hiện giao dịch nhanh.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống.
5. **Hậu điều kiện**: Không có.


--- END FILE: DashboardPage.md ---


--- START FILE: DepositPage.md ---

# Tài liệu Use Case: DepositPage

## 1. Thông tin chung
- **Tên màn hình**: Nạp tiền vào ví (Deposit Funds)
- **File**: `DepositPage.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Cho phép người dùng chuyển tiền từ thẻ ngân hàng đã liên kết vào số dư ví SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-DP-01: Chọn nguồn tiền (Source Selection)
- Hiển thị danh sách các thẻ ngân hàng đã liên kết để người dùng chọn.
- Hiển thị số dư hiện tại của từng thẻ (nếu có) để người dùng cân nhắc.
- Cung cấp lối tắt liên kết thẻ mới nếu người dùng chưa có thẻ nào.

### UC-DP-02: Nhập số tiền nạp
- Cho phép người dùng nhập thủ công số tiền muốn nạp.
- **Gợi ý nhanh (Quick Add)**: Các nút chọn nhanh mức giá phổ biến (50k, 100k, 200k, 500k).
- Kiểm tra số tiền nạp phải lớn hơn 0.

### UC-DP-03: Chi tiết giao dịch (Transaction Review)
- Hiển thị tóm tắt trước khi xác nhận: Số dư ví hiện tại, Số tiền nạp, Tổng tiền thanh toán.

### UC-DP-04: Lịch sử nạp tiền gần đây
- Hiển thị bảng danh sách các giao dịch nạp tiền từ thẻ trong quá khứ.
- Thông tin: Nội dung, Thời gian, Tên ngân hàng, Số thẻ (4 số cuối), Số tiền và Trạng thái (Thành công/Thất bại).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Nạp tiền vào ví
1. **Tên Use Case**: Nạp tiền từ thẻ ngân hàng.
2. **Mô tả vắn tắt**: Người dùng nạp tiền từ thẻ ngân hàng đã liên kết vào ví SmartPay.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Nạp tiền.
        2) Hệ thống hiển thị danh sách thẻ đã liên kết.
        3) Người dùng chọn thẻ muốn sử dụng. [A1]
        4) Người dùng nhập số tiền cần nạp hoặc chọn các mức gợi ý nhanh (50k, 100k, ...).
        5) Người dùng nhấn nút "Confirm Deposit".
        6) Hệ thống kiểm tra số dư và thông báo kết quả.
        7) Hệ thống cập nhật số dư ví và hiển thị thông báo thành công. [A2]
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Người dùng chưa liên kết thẻ**: Nếu không có thẻ nào, hệ thống hiển thị nút "Link New Card". Người dùng thực hiện liên kết thẻ trước khi nạp.
        2) **[A2] Giao dịch thất bại**: Nếu ngân hàng từ chối hoặc thẻ không đủ tiền, hệ thống hiển thị thông báo lỗi và yêu cầu kiểm tra lại nguồn tiền.
4. **Tiền điều kiện**: Đăng nhập thành công và có thẻ ngân hàng được liên kết.
5. **Hậu điều kiện**: Số dư ví được cập nhật, giao dịch được lưu vào lịch sử.


--- END FILE: DepositPage.md ---


--- START FILE: FaceAuthenticationPage.md ---

# Tài liệu Use Case: FaceAuthenticationPage

## 1. Thông tin chung
- **Tên màn hình**: Xác thực Khuôn mặt (Face Authentication)
- **File**: `FaceAuthenticationPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện quản lý và kiểm tra sinh trắc học khuôn mặt. Cho phép người dùng đăng ký các góc mặt (poses), xóa dữ liệu đã đăng ký và chạy thử nghiệm tính năng nhận diện.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FAP-01: Truyền phát video thực tế (Live Stream)
- Hiển thị luồng camera trực tiếp với khung định vị khuôn mặt.

### UC-FAP-02: So khớp sinh trắc học (Biometric Matching)
- Chụp ảnh khuôn mặt hiện tại và so sánh với Face Embedding đã lưu.
- Trả về điểm số tương đồng (Similarity Score).

### UC-FAP-03: Kết quả xác thực
- Thành công: Cho phép tiếp tục hành động (Chuyển tiền, v.v.).
- Thất bại: Hiển thị lỗi và cung cấp lựa chọn thử lại.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FAP-01: Độ chính xác
- Ngưỡng so khớp (Threshold) tối thiểu là 0.8 để đảm bảo an toàn.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Xác thực khuôn mặt (Face Verification)
1. **Tên Use Case**: So khớp khuôn mặt.
2. **Mô tả vắn tắt**: Hệ thống đối chiếu khuôn mặt hiện tại với dữ liệu đã đăng ký.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Hệ thống hiển thị màn hình Camera.
        2) Người dùng đưa mặt vào khung hình.
        3) Hệ thống tự động chụp và gửi dữ liệu so khớp.
        4) Server trả về kết quả độ tương đồng. [A1]
        5) Nếu độ tương đồng cao, xác thực thành công.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Xác thực thất bại**: Nếu không khớp, yêu cầu thử lại.
4. **Tiền điều kiện**: Đã đăng ký khuôn mặt.
5. **Hậu điều kiện**: Hành động được phê duyệt.


--- END FILE: FaceAuthenticationPage.md ---


--- START FILE: FaceManagementPage.md ---

# Tài liệu Use Case: FaceManagementPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Xác thực Khuôn mặt (Face ID Management)
- **File**: `FaceManagementPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện cho phép người dùng xem danh sách các góc mặt đã đăng ký và quản lý chúng (xóa hoặc đăng ký lại).

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FMP-01: Hiển thị danh sách góc mặt
- Hệ thống liệt kê 3 góc mặt: Chính diện, Trái, Phải.
- Hiển thị trạng thái "Đã đăng ký" hoặc "Chưa đăng ký" cho mỗi góc.

### UC-FMP-02: Quản lý Pose (Delete Pose)
- Cho phép người dùng xóa từng góc mặt đã đăng ký.
- Yêu cầu xác nhận (Confirmation Dialog) trước khi xóa.

### UC-FMP-03: Kiểm tra trạng thái bảo mật
- Hiển thị cảnh báo nếu người dùng chưa hoàn tất cả 3 góc mặt (Độ an toàn thấp).

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FMP-01: UX/UI
- Sử dụng icon trực quan (tích xanh, dấu X đỏ) để biểu thị trạng thái đăng ký.
- Cung cấp nút điều hướng nhanh đến trang đăng ký mới.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý mẫu khuôn mặt (Face Sample Management)
1. **Tên Use Case**: Xem và quản lý dữ liệu sinh trắc học.
2. **Mô tả vắn tắt**: Người dùng kiểm tra các mẫu khuôn mặt hiện có.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào trang "Biometric Management".
        2) Hệ thống hiển thị 3 trạng thái: Front, Left, Right.
        3) Người dùng nhấn biểu tượng "XÓA" để xóa một góc mặt cụ thể.
        4) Nhấn "Làm mới tất cả" để xóa toàn bộ các góc mặt đã đăng ký.
        5) Nhấn "Thêm góc mặt" hoặc "THÊM NGAY" để đi tới trang chụp ảnh khuôn mặt.
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Dữ liệu sinh trắc học được cập nhật.


--- END FILE: FaceManagementPage.md ---


--- START FILE: FaceRegisterPage.md ---

# Tài liệu Use Case: FaceRegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký Khuôn mặt (Face Registration)
- **File**: `FaceRegisterPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện hướng dẫn người dùng chụp các góc mặt để thiết lập bảo mật sinh trắc học.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FRP-01: Chụp ảnh 3 góc mặt (Multi-Angle Capture)
- Hệ thống hỗ trợ chụp 3 tư thế: Mặt trước (Front), Quay trái (Left), Quay phải (Right).
- Người dùng nhấn nút "Chụp ảnh" (photo_camera) để thực hiện chụp cho từng góc.

### UC-FRP-02: Kiểm tra và Gửi dữ liệu
- Hiển thị phản hồi "Thành công" và tích xanh sau khi chụp thành công từng góc.
- Ảnh được gửi lên server qua `faceService.registerFace` kèm theo định danh tư thế (pose).

### UC-FRP-03: Chế độ chụp đơn (Single Pose)
- Hệ thống hỗ trợ bổ sung một góc mặt cụ thể nếu được yêu cầu từ trang quản lý.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FRP-01: UX/UI
- Giao diện Live Camera với hiệu ứng quét (Scanning overlay) và nháy đèn (Flash effect) khi chụp.
- Hiển thị thanh tiến trình 3 bước trực quan bên cạnh khung hình Camera.
- Chế độ Dark/Light mode đồng bộ hệ thống.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký khuôn mặt (Face Registration)
1. **Tên Use Case**: Thiết lập xác thực khuôn mặt.
2. **Mô tả vắn tắt**: Người dùng tự đăng ký các góc mặt để sử dụng cho việc xác thực giao dịch sau này.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào màn hình "Face Registration".
        2) Hệ thống khởi tạo Camera và hiển thị luồng video.
        3) Người dùng điều chỉnh mặt vào khung và nhấn nút chụp cho góc hiện tại (ví dụ: Mặt trước).
        4) Hệ thống gửi ảnh lên server và hiển thị thông báo "Đã lưu góc mặt".
        5) Chuyển sang bước tiếp theo cho đến khi đủ 3 góc (Front -> Left -> Right).
        6) Sau khi hoàn tất, hệ thống điều hướng về trang quản lý bảo mật.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Lỗi camera**: Nếu không truy cập được camera, hệ thống hiển thị thông báo yêu cầu cấp quyền.
4. **Tiền điều kiện**: Thiết bị có camera, người dùng đã đăng nhập.
5. **Hậu điều kiện**: Các mẫu khuôn mặt được lưu trữ trên server.


--- END FILE: FaceRegisterPage.md ---


--- START FILE: FoodAndDrinkPage.md ---

# Tài liệu Use Case: FoodAndDrinkPage

## 1. Thông tin chung
- **Tên màn hình**: Đặt món trực tuyến (Food & Drink)
- **File**: `FoodAndDrinkPage.jsx`
- **Role**: Customer (Khách hàng)
- **Mô tả**: Giao diện chính để khách hàng tìm kiếm món ăn, xem chi tiết và thực hiện đặt hàng thông qua ví điện tử SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FDP-01: Tra cứu món ăn và Danh mục
- Hiển thị danh mục món ăn (Tab pills) với icon sinh động.
- Tìm kiếm món ăn theo tên (Search bar) với bộ lọc thời gian thực (Debounce 500ms).

### UC-FDP-02: Xem chi tiết sản phẩm (Product Modal)
- Hiển thị thông tin chi tiết: Tên, Giá, Mô tả, Đánh giá trung bình.
- Hiển thị thông tin nhà hàng cung cấp (Logo, Tên, Địa chỉ).
- Hiển thị danh sách nhận xét (Reviews) từ các khách hàng khác.

### UC-FDP-03: Quản lý Giỏ hàng nhanh
- Cho phép điều chỉnh số lượng món muốn mua (+/-) ngay trong Modal chi tiết.
- Tính toán tổng tiền dựa trên giá và số lượng tức thì.

### UC-FDP-04: Quy trình Đặt hàng (Checkout)
- Nhập thông tin giao hàng: Địa chỉ chi tiết, Tên người nhận, Số điện thoại.
- Thêm ghi chú cho nhà hàng.
- **Thanh toán**: Sử dụng mặc định phương thức "SmartPay".
- **Định vị**: Hỗ trợ nút sử dụng vị trí GPS hiện tại (Placeholder).

### UC-FDP-05: Kiểm tra số dư và Trạng thái nhà hàng
- Hiển thị số dư ví SmartPay hiện tại trên Header để khách hàng đối soát.
- Ngăn chặn đặt hàng nếu nhà hàng đang ở trạng thái "Đóng cửa".

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đặt món ăn (Order Food)
1. **Tên Use Case**: Tìm kiếm và đặt món ăn.
2. **Mô tả vắn tắt**: Khách hàng chọn món ăn từ các nhà hàng và thực hiện thanh toán qua ví.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Khách hàng truy cập trang "Food & Drink".
        2) Chọn Danh mục hoặc nhập tên món vào ô tìm kiếm.
        3) Nhấn vào thẻ món ăn để xem chi tiết.
        4) Chọn số lượng và nhấn "Add to Order".
        5) Nhập địa chỉ giao hàng, SĐT người nhận và ghi chú.
        6) Nhấn "Place Order via SmartPay".
        7) Hệ thống kiểm tra số dư ví. [A1]
        8) Hệ thống trừ tiền, tạo đơn hàng trạng thái "PENDING" và thông báo thành công.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Số dư không đủ**: Nếu giá trị đơn hàng lớn hơn số dư ví, hệ thống báo lỗi và yêu cầu nạp thêm tiền.
4. **Tiền điều kiện**: Đã đăng nhập và có số dư ví > 0.
5. **Hậu điều kiện**: Đơn hàng được khởi tạo và gửi tới nhà hàng.


--- END FILE: FoodAndDrinkPage.md ---


--- START FILE: LandingPage.md ---

# Tài liệu Use Case: LandingPage

## 1. Thông tin chung
- **Tên màn hình**: Trang chủ (Landing Page)
- **File**: `LandingPage.jsx`
- **Role**: Public User / Customer
- **Mô tả**: Trang giới thiệu dịch vụ SmartPay, cung cấp thông tin tổng quan về hệ sinh thái và điểm truy cập đăng nhập/đăng ký.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-LP-01: Giới thiệu hệ sinh thái SmartPay
- Hiển thị các tính năng cốt lõi: Chuyển tiền, Thanh toán hóa đơn, Tích lũy (Túi thần tài), Bảo mật.
- Hiển thị các đối tác chiến lược (Carousel chạy ngang).

### UC-LP-02: Chatbot Tư vấn tài chính
- Cung cấp cửa sổ chat tương tác với AI để giải đáp thắc mắc của người dùng.
- **Tính năng**:
    - Gửi/Nhận tin nhắn thời gian thực.
    - Hiển thị trạng thái "Đang trả lời..." khi AI xử lý.
    - Tự động cuộn xuống tin nhắn mới nhất.

### UC-LP-03: Điều hướng Hệ thống
- Nút "Đăng nhập" điều hướng tới trang Login.
- Nút "Đăng ký" điều hướng tới trang Register.
- Các liên kết nhanh (Anchor links) tới các phần: Tính năng, Tích lũy, Thanh toán, Bảo mật.

### UC-LP-04: Header bám dính (Sticky Header)
- Thanh menu luôn hiển thị khi người dùng cuộn trang để dễ dàng truy cập các tính năng điều hướng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Khám phá hệ sinh thái (Landing Page)
1. **Tên Use Case**: Xem thông tin giới thiệu dịch vụ.
2. **Mô tả vắn tắt**: Người dùng mới hoặc khách hàng vãng lai tìm hiểu về các tính năng của SmartPay.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập tên miền của hệ thống.
        2) Hệ thống hiển thị Hero Section với thông điệp chào mừng.
        3) Người dùng cuộn trang để xem các tính năng chính (Chuyển tiền, Tích lũy, Bảo mật).
        4) Nhấn vào nút "Get Started" hoặc "Log in" để chuyển sang trang xác thực.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Không có.

### 4.2 Mô tả usecase Tương tác với Chatbot AI
1. **Tên Use Case**: Tư vấn qua Chatbot.
2. **Mô tả vắn tắt**: Người dùng hỏi đáp thông tin với hệ thống thông qua giao diện chatbot.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng nhấn vào icon Chat ở góc màn hình.
        2) Nhập nội dung câu hỏi.
        3) Hệ thống hiển thị trạng thái "Thinking..." và trả về câu trả lời từ AI.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Không có.


--- END FILE: LandingPage.md ---


--- START FILE: LoanHistoryUser.md ---

# Use Case: Lịch sử vay vốn (User)

## 1. Tóm tắt
Người dùng theo dõi danh sách các hồ sơ vay đã gửi, kiểm tra trạng thái phê duyệt và xem chi tiết phản hồi từ hệ thống/Admin.

## 2. Các bên liên quan
*   **Tác nhân chính**: Người dùng (User).
*   **Hệ thống**: Backend API, AI Scoring.

## 3. Luồng công việc chính
1.  Người dùng truy cập vào mục **Lịch sử vay** (`/loans/history`).
2.  Hệ thống hiển thị danh sách các hồ sơ vay dưới dạng các thẻ (Cards):
    *   **Số tiền vay**.
    *   **Trạng thái**: Chờ duyệt, Đã duyệt, Hoàn tất, Đã từ chối.
    *   **Ngày yêu cầu**.
3.  Người dùng nhấn vào nút **"Chi tiết hồ sơ"** trên mỗi thẻ.
4.  Hệ thống hiển thị Modal chi tiết bao gồm:
    *   Thông tin thu nhập và nghề nghiệp đã khai báo.
    *   **Phân tích AI**: Hiển thị điểm rủi ro (AI Score) và quyết định của AI.
    *   **Phản hồi Admin**: Ghi chú lý do nếu hồ sơ bị từ chối hoặc cảnh báo.
5.  Người dùng xem tổng quan tài chính (Tổng đơn, Số đơn đã duyệt, Điểm tín dụng trung bình).

## 4. Các tính năng đặc biệt
*   **Bento Layout**: Giao diện hiển thị các thẻ đơn vay linh hoạt, trực quan.
*   **Phân màu trạng thái**:
    *   Xanh lá (Emerald): Đã duyệt/Hoàn tất.
    *   Vàng (Amber): Đang chờ (Pending AI/Admin).
    *   Đỏ (Red): Đã từ chối (Rejected).
*   **Cảnh báo gian lận**: Nếu Admin ghi chú "FRAUD ALERT", hệ thống sẽ hiển thị biểu tượng cảnh báo đỏ rực trên hồ sơ để người dùng biết.

## 5. Quy tắc hiển thị
*   **AI Score**: Được hiển thị dưới dạng phần trăm (Ví dụ: 25.50%).
*   **Phân trang**: Hệ thống tự động phân trang nếu người dùng có nhiều đơn vay.


--- END FILE: LoanHistoryUser.md ---


--- START FILE: LoanUserApply.md ---

# Use Case: Đăng ký vay vốn (User)

## 1. Tóm tắt
Người dùng có nhu cầu vay vốn thực hiện đăng ký hồ sơ vay trên hệ thống. Hệ thống sẽ sử dụng mô hình chấm điểm tín dụng AI (Credit Scoring) để đánh giá sơ bộ mức độ rủi ro trước khi chuyển hồ sơ cho Admin xét duyệt cuối cùng.

## 2. Các bên liên quan
*   **Tác nhân chính**: Người dùng (User).
*   **Tác nhân phối hợp**: Hệ thống AI (Mô hình XGBoost chấm điểm), Ngân hàng (Ví điện tử).

## 3. Tiền điều kiện
*   Người dùng đã đăng nhập vào hệ thống.
*   Người dùng đã hoàn tất định danh (KYC) - Hệ thống ưu tiên các cấp độ KYC cao hơn.

## 4. Luồng công việc chính (Happy Path)
1.  Người dùng truy cập vào trang **Vay vốn** (`/loans/apply`).
2.  Hệ thống hiển thị form đăng ký với các trường thông tin:
    *   **Số tiền vay**: Người dùng nhập số tiền mong muốn.
    *   **Kỳ hạn vay**: Chọn từ 3, 6, 9, 12, đến 24 tháng.
    *   **Mục đích vay**: Nhập lý do vay vốn.
    *   **Thu nhập khai báo**: Nhập mức thu nhập hàng tháng.
    *   **Phân khúc nghề nghiệp**: Chọn nhóm ngành nghề phù hợp (Công chức, Kinh doanh, Tự do, v.v.).
3.  Người dùng nhấn **"Gửi hồ sơ"**.
4.  Hệ thống thực hiện:
    *   Phân tích dữ liệu giao dịch thực tế của người dùng (Cashflow, Balance).
    *   Mô hình AI tính toán xác suất rủi ro (`aiScore`).
    *   Gửi hồ sơ vào hàng đợi chờ Admin phê duyệt.
5.  Hệ thống hiển thị thông báo gửi hồ sơ thành công và chuyển hướng sang trang lịch sử vay.

## 5. Các trường hợp ngoại lệ
*   **Hệ thống AI từ chối sớm**: Nếu `aiScore` vượt ngưỡng rủi ro cực cao, hệ thống có thể đánh dấu `REJECTED_AI` ngay lập tức (Tùy cấu hình).
*   **Thông tin không hợp lệ**: Người dùng nhập số tiền không nằm trong hạn mức cho phép hoặc để trống các trường bắt buộc. Hệ thống sẽ chặn và báo lỗi tại form.

## 6. Quy tắc nghiệp vụ
*   **Phân khúc nghề nghiệp**: Được mã hóa thành các con số chuẩn để AI có thể hiểu và chấm điểm.
*   **Logic Phê duyệt**:
    *   `PASSED_AI`: Hồ sơ có điểm rủi ro thấp, chuyển sang trạng thái `PENDING_ADMIN`.
    *   `PENDING_ADMIN`: Trạng thái mặc định chờ Admin ra quyết định cuối cùng.

## 7. Giao diện (UI Features)
*   Form nhập liệu thiết kế hiện đại, tối giản.
*   Sử dụng SweetAlert2 để thông báo trạng thái gửi đơn.
*   Hiển thị các gói vay ưu đãi (6.5%/năm) để thu hút người dùng.


--- END FILE: LoanUserApply.md ---


--- START FILE: LoginPage.md ---

# Tài liệu Use Case: LoginPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng nhập (Login)
- **File**: `LoginPage.jsx`
- **Role**: Guest / User
- **Mô tả**: Giao diện cho phép người dùng đăng nhập vào hệ thống SmartPay bằng tài khoản đã đăng ký.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-LP-01: Nhập liệu thông tin đăng nhập
- Người dùng nhập Username và Password vào các trường tương ứng.
- Hỗ trợ tính năng hiển thị mật khẩu (Show/Hide password).
- Có link "Quên mật khẩu?" dẫn đến trang khôi phục (đang phát triển).

### UC-LP-02: Xác thực và Điều hướng (Role-based Routing)
- Hệ thống kiểm tra thông tin đăng nhập với server.
- Sau khi thành công, điều hướng dựa trên vai trò:
    - ADMIN → `/admin/transactions`
    - SHIPPER → `/shipper/orders`
    - RESTAURANT_OWNER → `/merchant/dashboard`
    - CUSTOMER/USER → `/dashboard`

### UC-LP-03: Kiểm tra trạng thái tài khoản
- Ngăn chặn đăng nhập nếu tài khoản đang ở trạng thái `INACTIVE` hoặc `active === false`.
- Hiển thị thông báo: "Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên."

### UC-LP-04: Đăng nhập mạng xã hội
- Hỗ trợ các nút đăng nhập nhanh qua Google và Apple.

### UC-LP-05: Carousel giới thiệu
- Hiển thị Carousel giới thiệu các tính năng (Xác thực, Quản lý, Bảo vệ) ở phía bên phải màn hình (Desktop mode).

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-LP-01: Bảo mật
- Mật khẩu được mã hóa khi gửi qua mạng.
- Sử dụng JWT Token để duy trì phiên làm việc.

### NFR-LP-02: UX/UI
- Giao diện hiện đại với phong cách Glassmorphism và hiệu ứng ánh sáng.
- Thông báo lỗi rõ ràng bên dưới tiêu đề khi sai thông tin hoặc tài khoản chưa kích hoạt.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng nhập (User Login)
1. **Tên Use Case**: Xác thực người dùng.
2. **Mô tả vắn tắt**: Người dùng đăng nhập để truy cập các tính năng của hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng nhập Username và Password.
        2) Hệ thống kiểm tra thông tin đăng nhập trên server. [A1]
        3) Nếu đúng, hệ thống lấy thông tin User và kiểm tra trạng thái hoạt động. [A2]
        4) Nếu tài khoản active, hệ thống lưu JWT Token và thông tin User vào context.
        5) Hệ thống điều hướng người dùng về trang Dashboard tương ứng với vai trò.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Sai thông tin**: Hệ thống hiển thị thông báo lỗi (ví dụ: "Đăng nhập thất bại").
        2) **[A2] Tài khoản chưa kích hoạt**: Hệ thống hiển thị thông báo "Tài khoản của bạn chưa được kích hoạt...".
4. **Tiền điều kiện**: Đã có tài khoản.
5. **Hậu điều kiện**: Người dùng truy cập thành công vào hệ thống.


--- END FILE: LoginPage.md ---


--- START FILE: ProfilePage.md ---

# Tài liệu Use Case: User Profile

## 1. Thông tin chung
- **Tên màn hình**: Hồ sơ cá nhân (Personal Information)
- **File**: `ProfilePage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Quản lý thông tin cá nhân, ảnh đại diện và trạng thái bảo mật của người dùng.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-UP-01: Xem và Cập nhật thông tin cơ bản
- Hiển thị thông tin: Họ tên, Email (Chỉ xem), Số điện thoại, Ngày sinh, Địa chỉ.
- Cho phép chỉnh sửa (Inline Editing) và lưu thay đổi vào hệ thống.

### UC-UP-02: Quản lý Ảnh đại diện (Avatar)
- Cho phép tải ảnh lên từ máy tính.
- **Ràng buộc**: Định dạng ảnh hợp lệ, dung lượng dưới 2MB.
- Tự động chuẩn hóa ảnh sang Base64 để gửi API.

### UC-UP-03: Theo dõi Trạng thái Bảo mật (Security Status)
- Hiển thị huy hiệu "Đã xác thực" (Verified Badge) nếu thông tin người dùng đã được duyệt.
- Kiểm tra và hiển thị tình trạng đăng ký sinh trắc học khuôn mặt ngay tại trang Profile.
- Cung cấp lối tắt đến trang Quản lý Face ID nếu trạng thái là "Cần hành động".

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Cập nhật hồ sơ cá nhân
1. **Tên Use Case**: Chỉnh sửa thông tin cá nhân.
2. **Mô tả vắn tắt**: Người dùng thay đổi thông tin cá nhân và ảnh đại diện để cá nhân hóa tài khoản.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang "Profile".
        2) Hệ thống hiển thị thông tin hiện tại từ API.
        3) Người dùng nhấn chỉnh sửa các trường: Họ tên, Số điện thoại, Địa chỉ.
        4) Chọn ảnh đại diện mới từ thiết bị (Optional).
        5) Nhấn "Save Profile".
        6) Hệ thống tải ảnh (Base64) và gửi dữ liệu cập nhật lên server.
        7) Thông báo thành công và cập nhật lại thông tin hiển thị.
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Thông tin người dùng được cập nhật trong cơ sở dữ liệu.


--- END FILE: ProfilePage.md ---


--- START FILE: ReceiveMoneyPage.md ---

# Tài liệu Use Case: ReceiveMoneyPage

## 1. Thông tin chung
- **Tên màn hình**: Nhận tiền (Receive Money)
- **File**: `ReceiveMoneyPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện cung cấp mã QR cá nhân để nhận tiền từ người dùng khác trong hệ thống.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-RMP-01: Hiển thị mã QR tĩnh
- Hệ thống tự động tạo và hiển thị mã QR đại diện cho ví cá nhân của người dùng.

### UC-RMP-02: Tạo mã QR theo số tiền (Set Amount)
- Cho phép người dùng nhập một số tiền cụ thể.
- Hệ thống cập nhật mã QR tương ứng để người quét không cần nhập tay số tiền.

### UC-RMP-03: Chia sẻ và Tải xuống
- Hỗ trợ nút "Download" để lưu mã QR dạng hình ảnh.
- Hỗ trợ tính năng "Share" để gửi mã QR qua các ứng dụng nhắn tin.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-RMP-01: Hiệu năng
- Mã QR phải được tạo nhanh (< 200ms) sau khi thay đổi số tiền.

### NFR-RMP-02: UX/UI
- Giao diện tối giản, tập trung vào mã QR.
- Mã QR có độ tương phản cao, dễ quét.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Nhận tiền qua mã QR (Receive Money)
1. **Tên Use Case**: Tạo và chia sẻ mã QR nhận tiền.
2. **Mô tả vắn tắt**: Người dùng tạo mã QR cá nhân hoặc mã QR kèm số tiền để người khác quét nạp tiền/chuyển tiền.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào trang "Receive Money".
        2) Hệ thống hiển thị QR tĩnh mặc định.
        3) Người dùng nhấn "Set Amount" và nhập số tiền.
        4) Hệ thống tạo QR mới chứa thông tin số tiền.
        5) Người dùng nhấn "Download" để lưu ảnh QR về máy.
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Mã QR được tạo thành công.


--- END FILE: ReceiveMoneyPage.md ---


--- START FILE: RegisterPage.md ---

# Tài liệu Use Case: RegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký (Register)
- **File**: `RegisterPage.jsx`
- **Role**: Guest
- **Mô tả**: Giao diện cho phép người dùng mới tạo tài khoản SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-RP-01: Nhập liệu thông tin đăng ký
- Các trường: Username, Full Name, Email, Phone, Password, Confirm Password.

### UC-RP-02: Ràng buộc dữ liệu (Validation)
- Username: 4-20 ký tự (chỉ chữ, số, gạch dưới).
- Email: Định dạng email hợp lệ.
- Phone: Định dạng số điện thoại Việt Nam.
- Password: Tối thiểu 8 ký tự, bao gồm cả chữ và số.
- Confirm Password: Phải khớp với mật khẩu đã nhập.

### UC-RP-03: Khởi tạo dữ liệu
- Sau khi đăng ký thành công, hệ thống tự động khởi tạo mặc định một ví điện tử cho người dùng.

### UC-RP-04: Phản hồi sau đăng ký
- Hiển thị thông báo thành công kèm số tài khoản ví (AccountNumber) được cấp.
- Điều hướng người dùng về trang Login.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-RP-01: UX/UI
- Thông báo lỗi chi tiết (ví dụ: "Email đã tồn tại") ngay khi gặp lỗi 409 từ server.
- Sử dụng hiệu ứng mượt mà khi chuyển đổi giữa các bước nhập liệu.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký tài khoản (User Registration)
1. **Tên Use Case**: Đăng ký người dùng mới.
2. **Mô tả vắn tắt**: Người dùng mới tự tạo tài khoản để tham gia hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Đăng ký.
        2) Nhập Username, Full Name, Email, Phone, Password.
        3) Nhấn "Create Account".
        4) Hệ thống kiểm tra tính hợp lệ và duy nhất của dữ liệu. [A1]
        5) Hệ thống tạo tài khoản và ví mặc định.
        6) Hiển thị thông báo thành công kèm số tài khoản ví.
        7) Điều hướng về trang Đăng nhập.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Dữ liệu trùng lặp**: Hệ thống báo lỗi "Email/Username already exists" và yêu cầu thay đổi.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Một tài khoản `USER` mới được tạo.


--- END FILE: RegisterPage.md ---


--- START FILE: SpendingSummaryPage.md ---

# Tài liệu Use Case: SpendingSummaryPage

## 1. Thông tin chung
- **Tên màn hình**: Tổng kết chi tiêu (Spending Summary)
- **File**: `SpendingSummaryPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Trang phân tích và thống kê thói quen chi tiêu của người dùng thông qua biểu đồ và danh sách giao dịch.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-SSP-01: Thống kê chỉ số tài chính
- Hiển thị 3 chỉ số then chốt: Tổng số dư, Chi tiêu tháng hiện tại, Tiết kiệm dự kiến.

### UC-SSP-02: Biểu đồ hoạt động chi tiêu
- Hiển thị biểu đồ cột mô tả biến động chi tiêu trong 7 ngày gần nhất.
- Cho phép tương tác với từng cột để xem giá trị cụ thể.

### UC-SSP-03: Phân loại giao dịch
- Liệt kê các giao dịch gần đây kèm icon phân loại (Food, Shopping, Income, v.v.).

### UC-SSP-04: Xuất báo cáo
- Nút "Download Statement" để tải sao kê định dạng tài liệu.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-SSP-01: UX/UI
- Sử dụng màu sắc tương phản để phân biệt dòng tiền vào (Income) và tiền ra (Spending).
- Biểu đồ phải có hoạt ảnh (Animation) khi tải dữ liệu.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Tổng kết chi tiêu (Spending Summary)
1. **Tên Use Case**: Phân tích biểu đồ chi tiêu.
2. **Mô tả vắn tắt**: Người dùng xem báo cáo định kỳ về thói quen chi tiêu của bản thân.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào trang "Spending Summary".
        2) Hệ thống hiển thị tổng số dư và biểu đồ cột chi tiêu theo tuần.
        3) Người dùng nhấn vào các cột biểu đồ để xem chi tiết chi tiêu của ngày đó.
        4) Nhấn "Download Statement" để tải file báo cáo.
4. **Tiền điều kiện**: Đã đăng nhập và có phát sinh giao dịch.
5. **Hậu điều kiện**: Không có.


--- END FILE: SpendingSummaryPage.md ---


--- START FILE: TransferHistoryPage.md ---

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
        4) Nhấn "Send Now".
        5) **Kiểm tra rủi ro (AI Fraud Check)**: Hệ thống gọi API AI để đánh giá mức độ rủi ro của giao dịch. [A3]
        6) **Xác thực khuôn mặt (Face Verification)**: Nếu giao dịch rơi vào vùng "Review", yêu cầu người dùng xác thực khuôn mặt để tiếp tục. [A4]
        7) **Xác nhận giao dịch**: Hệ thống kiểm tra số dư ví người gửi. [A2]
        8) Hệ thống thực hiện trừ tiền người gửi, cộng tiền người nhận và thông báo thành công.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không tìm thấy người dùng**: Nếu SĐT không tồn tại trên hệ thống, hiển thị thông báo "User not found".
        2) **[A2] Số dư không đủ**: Nếu số tiền chuyển vượt quá số dư ví, hiển thị thông báo lỗi và không cho phép thực hiện.
        3) **[A3] Giao dịch bị từ chối bởi AI**: Nếu AI đánh giá rủi ro quá cao, giao dịch bị chặn ngay lập tức.
        4) **[A4] Xác thực khuôn mặt thất bại**: Nếu không khớp khuôn mặt, giao dịch bị hủy.
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


--- END FILE: TransferHistoryPage.md ---


--- START FILE: WalletFinance.md ---

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


--- END FILE: WalletFinance.md ---


--- START FILE: Withdraw.md ---

# Tài liệu Use Case: WithdrawPage

## 1. Thông tin chung
- **Tên màn hình**: Rút tiền về tài khoản (Withdraw Funds)
- **File**: `Withdraw.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Cho phép người dùng chuyển tiền từ số dư ví SmartPay về tài khoản ngân hàng hoặc thẻ đã liên kết. Hỗ trợ thêm thẻ mới ngay tại màn hình.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-WP-01: Chọn tài khoản đích (Recipient Account)
- Hiển thị danh sách các thẻ/tài khoản ngân hàng đã liên kết.
- Cho phép người dùng chọn một tài khoản để nhận tiền.

### UC-WP-02: Liên kết thẻ mới (Add New Card)
- Cung cấp Modal để người dùng nhập thông tin thẻ mới (Số thẻ, Tên chủ thẻ, Ngày hết hạn, CVV, Loại thẻ, Ngân hàng).
- Hệ thống lưu trữ và cập nhật danh sách thẻ ngay lập tức.

### UC-WP-03: Quản lý số tiền rút
- Hiển thị Số dư khả dụng (Available Balance).
- Hỗ trợ nút "Max" để tự động điền số tiền rút tối đa có thể (đã trừ phí 5%).
- Các nút chọn nhanh: 50.000đ, 500.000đ, 1.000.000đ.
- Kiểm tra tính hợp lệ: Số tiền rút + Phí dịch vụ (5%) không được vượt quá số dư khả dụng.

### UC-WP-04: Tính toán Phí dịch vụ (Service Fee)
- Tự động tính phí dịch vụ cố định là **5%** trên số tiền rút.
- Hiển thị "Tổng tiền bị trừ" (Total Deducted) = Số tiền rút + (Số tiền rút * 5%).

### UC-WP-05: Xem lịch sử rút tiền gần đây
- Hiển thị bảng danh sách các lệnh rút tiền gần nhất với các trạng thái: SUCCESS (Thành công), PENDING (Đang xử lý), FAILED (Thất bại).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Rút tiền về tài khoản
1. **Tên Use Case**: Rút tiền từ ví về ngân hàng.
2. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Rút tiền.
        2) Hệ thống hiển thị số dư khả dụng và thông tin phí dịch vụ (5%).
        3) Người dùng chọn tài khoản ngân hàng nhận tiền hoặc thêm thẻ mới qua Modal.
        4) Người dùng nhập số tiền hoặc chọn các mức tiền gợi ý/nhấn "Max".
        5) Hệ thống tự động tính và hiển thị phí dịch vụ (5%) và Tổng tiền bị trừ.
        6) Người dùng nhấn "Xác nhận rút tiền".
        7) Hệ thống kiểm tra điều kiện số dư và thực hiện giao dịch.
    - **3.2 Các luồng rẽ nhánh**:
        1) **Số dư không đủ**: Hệ thống báo lỗi "Số dư không đủ" nếu Tổng khấu trừ > Số dư khả dụng.
        2) **Thêm thẻ thất bại**: Nếu thông tin thẻ không hợp lệ, hệ thống báo lỗi trong Modal.
3. **Tiền điều kiện**: Có số dư ví và đã liên kết ít nhất một tài khoản ngân hàng (hoặc thực hiện liên kết ngay tại trang).
4. **Hậu điều kiện**: Số dư ví giảm, biến động số dư được ghi nhận vào lịch sử giao dịch.


--- END FILE: Withdraw.md ---


--- START FILE: historyorderbyuser.md ---

# Tài liệu Use Case: historyorderbyuser

## 1. Thông tin chung
- **Tên màn hình**: Lịch sử đơn hàng (Order History)
- **File**: `historyorderbyuser.jsx`
- **Role**: Customer (Khách hàng)
- **Mô tả**: Nơi khách hàng quản lý và theo dõi toàn bộ các đơn đặt hàng đã thực hiện, từ các đơn đang chờ đến các đơn đã hoàn tất hoặc bị hủy.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-HOU-01: Phân loại đơn hàng theo trạng thái (Tabs)
- Bộ lọc nhanh theo các trạng thái: Chờ duyệt, Đã xác nhận, Đang chuẩn bị, Chờ lấy hàng, Đang giao, Hoàn thành, Đã hủy.

### UC-HOU-02: Tìm kiếm đơn hàng nâng cao
- Cho phép tìm kiếm đơn hàng dựa trên: Mã đơn (#ID), Tên khách hàng, Tên nhà hàng, hoặc Tên món ăn trong đơn.

### UC-HOU-03: Hiển thị tóm tắt Đơn hàng (Order Cards)
- Mỗi thẻ đơn hàng hiển thị:
    - **Bộ sưu tập ảnh**: Hiển thị tối đa 3 ảnh món ăn đầu tiên (dạng chồng lên nhau - Stacked images).
    - Mã đơn hàng, Thời gian đặt, Trạng thái (kèm màu sắc phân biệt).
    - Tên nhà hàng và tổng số lượng món.
    - Tổng số tiền thanh toán.

### UC-HOU-04: Tải dữ liệu linh hoạt (Load More)
- Hỗ trợ tính năng "Xem thêm" (Pagination/Infinite scroll) để truy xuất các đơn hàng cũ mà không làm chậm trang.

### UC-HOU-05: Truy cập Chi tiết và Theo dõi
- Nút "Track" (Theo dõi) dẫn người dùng đến trang chi tiết để xem lộ trình đơn hàng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Tra cứu lịch sử đặt hàng (Customer)
1. **Tên Use Case**: Xem danh sách đơn hàng đã đặt.
2. **Mô tả vắn tắt**: Khách hàng xem lại các đơn hàng cũ hoặc theo dõi đơn hàng mới nhất của mình.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Khách hàng truy cập trang "Order History".
        2) Hệ thống hiển thị danh sách đơn hàng dưới dạng thẻ (Cards).
        3) Khách hàng sử dụng các Tab trạng thái (Pending, Completed...) để lọc đơn.
        4) Khách hàng nhập Mã đơn hoặc Tên món vào ô tìm kiếm.
        5) Nhấn "Track" hoặc vào thẻ đơn để xem chi tiết.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không có đơn hàng**: Nếu chưa có đơn, hệ thống hiển thị hình ảnh minh họa trống và nút "Order Now".
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Không có.


--- END FILE: historyorderbyuser.md ---


--- START FILE: vieworder.md ---

# Tài liệu Use Case: vieworder

## 1. Thông tin chung
- **Tên màn hình**: Theo dõi đơn hàng chi tiết (Order Details & Tracking)
- **File**: `vieworder.jsx`
- **Role**: Customer (Khách hàng)
- **Mô tả**: Trang chi tiết dành cho khách hàng để giám sát quy trình thực hiện món ăn và giao hàng trong thời gian thực.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-VO-01: Lộ trình xử lý đơn (Visual Timeline)
- Hiển thị 6 bước quan trọng của đơn hàng bằng các icon trực quan: Đã đặt -> Xác nhận -> Đang nấu -> Chờ lấy hàng -> Đang giao -> Hoàn thành.
- Các bước đã hoàn tất được đánh dấu màu xanh (Emerald) kèm thời gian xử lý thực tế.

### UC-VO-02: Chi tiết Sản phẩm và Thanh toán
- Liệt kê bảng danh sách món ăn: Ảnh, Tên món, Số lượng, Đơn giá, Tạm tính.
- Hiển thị Tổng thanh toán cuối cùng nổi bật.

### UC-VO-03: Thông tin đối tác (Shipper & Restaurant)
- **Tài xế**: Hiển thị ảnh đại diện, Tên và Số điện thoại liên lạc khi đơn hàng đang giao.
- **Nhà hàng**: Hiển thị tên nhà hàng cung cấp.

### UC-VO-04: Thông tin nhận hàng
- Hiển thị thông tin người nhận: Tên, SĐT, Địa chỉ giao hàng và Ghi chú đặc biệt.

### UC-VO-05: Các thao tác hỗ trợ
- **Đặt lại ngay (Reorder)**: Cho phép tạo nhanh một đơn hàng mới tương tự đơn cũ chỉ với một nút bấm.
- **Hủy đơn hàng (Cancel)**: Khách hàng có thể yêu cầu hủy đơn kèm lý do nếu đơn hàng đang ở trạng thái Chờ duyệt hoặc vừa được xác nhận.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-VO-01: Cập nhật thời gian thực (Real-time Tracking)
- Hệ thống cố gắng truy xuất thông tin Tracking liên tục nếu đơn hàng đang trong trạng thái "Đang chuẩn bị" hoặc "Đang giao".

### NFR-VO-02: UX/UI (Attention to Detail)
- Ghi chú của khách hàng được đặt trong khung màu vàng (Amber) để người dùng dễ dàng kiểm tra lại yêu cầu của mình.
- Sử dụng font chữ Monospace cho các số liệu tài chính và mã đơn để tăng độ chuyên nghiệp.

### NFR-VO-03: Tính bảo mật và Riêng tư
- Thông tin của tài xế chỉ được hiển thị khi đơn hàng đã được chỉ định (Assigned) cho tài xế đó.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Theo dõi đơn hàng (Order Tracking)
1. **Tên Use Case**: Xem lộ trình và chi tiết đơn hàng.
2. **Mô tả vắn tắt**: Khách hàng kiểm tra trạng thái thực thi đơn hàng và thông tin các bên liên quan.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Khách hàng nhấn "Track" từ lịch sử đơn hàng hoặc thông báo.
        2) Hệ thống hiển thị Timeline 6 bước với trạng thái hiện tại nổi bật.
        3) Hệ thống hiển thị thông tin Shipper (nếu đã nhận đơn).
        4) Khách hàng xem danh sách món ăn và tổng thanh toán.
    - **3.2 Luồng hủy đơn hàng**:
        1) Khách hàng nhấn "Cancel Order" (chỉ khả dụng khi đơn mới khởi tạo).
        2) Hệ thống yêu cầu xác nhận và lý do.
        3) Hệ thống gọi API hủy đơn và thông báo kết quả. [A1]
    - **3.3 Các luồng rẽ nhánh**:
        1) **[A1] Đơn đã được nhà hàng chuẩn bị**: Nếu nhà hàng đã bắt đầu nấu, khách hàng không thể tự hủy đơn và phải liên hệ hỗ trợ.
4. **Tiền điều kiện**: Đã đặt đơn hàng thành công.
5. **Hậu điều kiện**: Không có.


--- END FILE: vieworder.md ---

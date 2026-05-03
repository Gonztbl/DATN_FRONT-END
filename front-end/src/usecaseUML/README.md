# 📋 Tổng hợp Use Case & Biểu đồ Sequence - SmartPay System

## Giới thiệu

Tài liệu này tổng hợp toàn bộ Use Case và biểu đồ trình tự (Sequence Diagram) của hệ thống **SmartPay** - nền tảng ví điện tử tích hợp đặt đồ ăn.

- Các biểu đồ được viết theo chuẩn **PlantUML**, sử dụng mẫu **BCE (Boundary–Control–Entity)**.
- Thư mục chứa file `.puml`: `src/usecaseUML/`
- Render online tại: https://www.plantuml.com/plantuml/uml/

---

## 📦 Danh sách Use Case

### 🔐 Module: Xác thực (Authentication)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC01 | Đăng nhập hệ thống | `UC01_DangNhap.puml` | User/Admin/Shipper/Merchant | Xác thực username + password, điều hướng theo role |
| UC02 | Đăng ký tài khoản | `UC02_DangKy.puml` | User mới | Tạo tài khoản với validate client + server, xử lý conflict 409 |
| UC03 | Đăng ký khuôn mặt | `UC03_DangKyKhuonMat.puml` | User | Chụp 3 tư thế (front/left/right) → lưu face embedding |
| UC04 | Xác thực khuôn mặt | `UC04_XacThucKhuonMat.puml` | User | So sánh ảnh chụp với embedding đã lưu |
| UC05 | Quản lý khuôn mặt | `UC05_QuanLyKhuonMat.puml` | User | Xem, xóa, thêm tư thế khuôn mặt đã đăng ký |
| UC83 | Quản lý Hồ sơ cá nhân | `UC83_HoSoCaNhan.puml` | User | Xem thông tin chi tiết và cập nhật hồ sơ (tên, avatar) |

---

### 💰 Module: Ví điện tử (Wallet)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC06 | Xem tổng quan ví | `UC06_XemSoDuVi.puml` | User | Tải song song: số dư, thẻ, liên hệ, giao dịch gần đây |
| UC07 | Nạp tiền vào ví | `UC07_NapTienVi.puml` | User | Chọn thẻ ngân hàng và nạp tiền vào ví |
| UC08 | Rút tiền từ ví | `UC08_RutTienVi.puml` | User | Rút tiền ra thẻ ngân hàng, tính phí dịch vụ |
| UC09 | Chuyển tiền P2P | `UC09_ChuyenTien.puml` | User | Chuyển tiền cho người dùng khác, optimistic UI update |
| UC10 | Nhận tiền qua QR | `UC10_NhanTienQR.puml` | User (nhận) | Tạo QR code, theo dõi giao dịch đến |
| UC11 | Lịch sử giao dịch | `UC11_LichSuGiaoDich.puml` | User | Xem, lọc, phân trang lịch sử giao dịch |
| UC12 | Thống kê chi tiêu | `UC12_ThongKeChi.puml` | User | Thống kê theo kỳ, biểu đồ chi tiêu |
| UC84 | Bảng điều khiển ví | `UC84_BangDieuKhienVi.puml` | User | Tổng hợp số dư, thẻ rút/nạp nhanh, biểu đồ & giao dịch mới nhất |

---

### 🍔 Module: Đặt đồ ăn (Shopping / Food Ordering)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC13 | Đặt món ăn | `UC13_DatMonAn.puml` | User | Duyệt thực đơn, xem chi tiết, đặt hàng qua SmartPay |
| UC14 | Lịch sử đơn hàng | `UC14_LichSuDonHang.puml` | User | Xem, lọc theo trạng thái, tải thêm, tìm kiếm |
| UC15 | Chi tiết & hủy đơn | `UC15_ChiTietDonHang.puml` | User | Theo dõi timeline, hủy đơn PENDING, đặt lại đơn |

---

### 🚴 Module: Giao hàng (Shipper)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC16 | Shipper nhận đơn | `UC16_ShipperNhanDon.puml` | Shipper | Xem đơn chờ lấy, nhận đơn, xác nhận lấy hàng |
| UC17 | Shipper giao hàng | `UC17_ShipperGiaoHang.puml` | Shipper | Xem chi tiết đơn, xác nhận giao thành công / báo thất bại |
| UC87 | Bảng điều khiển tài xế | `UC87_ShipperDashboard.puml` | Shipper | Thống kê thu nhập, xem danh sách đơn gợi ý quanh vị trí |
| UC88 | Quản lý trạng thái và hồ sơ | `UC88_ShipperHoSo.puml` | Shipper | Xem thông tin phương tiện, chuyển trạng thái Online/Offline |

---

### 🏪 Module: Nhà hàng (Restaurant / Merchant)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC18 | Nhà hàng quản lý đơn | `UC18_NhaHangQuanLyDon.puml` | Merchant | Xem đơn theo tab, xác nhận, báo sẵn sàng, từ chối đơn |
| UC19 | Nhà hàng quản lý menu | `UC19_NhaHangQuanLyMenu.puml` | Merchant | CRUD sản phẩm, toggle trạng thái AVAILABLE/UNAVAILABLE |
| UC20 | Nhà hàng cài đặt | `UC20_NhaHangCaiDat.puml` | Merchant | Cập nhật thông tin, toggle mở/đóng cửa, lịch hoạt động |
| UC85 | Bảng điều khiển cửa hàng| `UC85_NhaHangDashboard.puml` | Merchant | Xem thống kê doanh thu, đơn hàng tổng quan |
| UC86 | Chi tiết đơn hàng (Nhà hàng)| `UC86_NhaHangChiTietDon.puml` | Merchant | Xem chi tiết item, ghi chú và xử lý thay đổi trạng thái |

---

### 🛡️ Module: Quản trị (Admin)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC21 | Admin quản lý user | `UC21_AdminQuanLyNguoiDung.puml` | Admin | Xem, lọc, tìm kiếm, khóa/mở khóa tài khoản người dùng |
| UC22 | Admin quản lý đơn hàng | `UC22_AdminQuanLyDonHang.puml` | Admin | Xem toàn bộ đơn hàng hệ thống, lọc đa điều kiện, xóa đơn |
| UC59 | Admin xem danh sách ví | `UC59_AdminXemVi.puml` | Admin | Theo dõi số dư và trạng thái ví toàn hệ thống |
| UC60 | Admin nạp tiền (Topup) | `UC60_AdminTopup.puml` | Admin | Nạp tiền thủ công cho người dùng trong trường hợp đặc biệt |
| UC61 | Khóa/Mở khóa ví Admin | `UC61_AdminKhoaMoKhoaVi.puml` | Admin | Đóng băng hoặc kích hoạt lại ví điện tử |
| UC62 | Admin xem giao dịch | `UC62_AdminXemGiaoDich.puml` | Admin | Tra cứu toàn bộ lịch sử dòng tiền trong hệ thống |
| UC63 | Chi tiết giao dịch Admin | `UC63_AdminChiTietGiaoDich.puml` | Admin | Xem biên lai và ghi chú chi tiết của một giao dịch |
| UC64 | Quản lý nhà hàng (Admin)| `UC64_AdminQuanLyNhaHang.puml` | Admin | CRUD đối tác nhà hàng và gán chủ sở hữu |
| UC65 | Quản lý danh mục | `UC65_AdminQuanLyDanhMuc.puml` | Admin | Định nghĩa các loại hình dịch vụ (Food, Drink...) |
| UC66 | Phân tích chi tiêu | `UC66_PhanTichChiTieu.puml` | User | Biểu đồ thống kê thói quen tài chính cá nhân |
| UC67 | Nhận tiền qua mã QR | `UC67_NhanTienQR.puml` | User | Tạo mã QR tĩnh hoặc QR kèm số tiền để nhận tiền |
| UC68 | Chuyển tiền qua SĐT | `UC68_ChuyểnTiềnSDT.puml` | User | Chuyển tiền P2P nhanh chóng qua số điện thoại |
| UC69 | Xem lịch sử giao dịch | `UC69_XemLichSuGiaoDich.puml` | User | Tra cứu biến động số dư cá nhân |
| UC70 | Admin đăng ký khuôn mặt | `UC70_AdminDangKyMat.puml` | Admin | Đăng ký 3 tư thế sinh trắc học cho người dùng |
| UC71 | Admin xác thực khuôn mặt | `UC71_AdminXacThucMat.puml` | Admin | Kiểm tra độ chính xác của nhận diện khuôn mặt tại chỗ |
| UC72 | Admin tạo người dùng | `UC72_AdminTaoNguoiDung.puml` | Admin | Khởi tạo tài khoản và ví cho nhân viên hoặc đối tác |
| UC73 | Admin chi tiết hồ sơ | `UC73_AdminChiTietUser.puml` | Admin | View 360 độ thông tin người dùng (Ví, Face, Logs) |
| UC74 | Admin quản lý sản phẩm | `UC74_AdminQuanLySanPham.puml` | Admin | Quản lý thực đơn toàn hệ thống (Duyệt, Toggle Status) |
| UC75 | Admin quản lý đơn hàng | `UC75_AdminQuanLyDonHang.puml` | Admin | Theo dõi luồng vận hành, hủy đơn và hoàn tiền tự động |
| UC76 | Admin quản lý Merchant | `UC76_AdminQuanLyMerchant.puml` | Admin | Quản lý trạng thái hợp tác của các Merchant |
| UC77 | Admin quản lý Shipper | `UC77_AdminQuanLyShipper.puml` | Admin | Giám sát hồ sơ và phương tiện của tài xế |
| UC78 | Phân phối doanh thu (95/5)| `UC78_PhanPhoiDoanhThu.puml` | System | Tự động chia tiền cho Nhà hàng và Shipper khi hoàn tất |
| UC79 | Admin Dashboard Tài chính| `UC79_AdminTaiChinh.puml` | Admin | Thống kê doanh thu và tổng số dư toàn hệ thống |
| UC80 | Admin chi tiết đơn hàng | `UC80_AdminChiTietDonHang.puml` | Admin | Xem timeline và chi tiết đối soát của một đơn hàng |

---

### 🌐 Module: Khám phá & Trợ lý ảo (Discovery & AI Assistant)

| Mã UC | Tên Use Case | File PlantUML | Actor | Tóm tắt |
|-------|-------------|---------------|-------|---------|
| UC81 | Xem Landing Page | `UC81_LandingPage.puml` | Guest/User | Truy cập trang chủ giới thiệu ứng dụng, tải ứng dụng |
| UC82 | Chatbot AI Hỗ trợ | `UC82_ChatbotAI.puml` | User | Nhắn tin hỏi đáp với trợ lý AI, đề xuất món ăn/dịch vụ |

---

## 🔄 Luồng trạng thái đơn hàng

```
PENDING
  │
  ├─[Nhà hàng xác nhận]──► CONFIRMED
  │                                │
  │                    [Nhà hàng báo sẵn sàng]
  │                                │
  │                         READY_FOR_PICKUP
  │                                │
  │                    [Shipper nhận đơn & lấy hàng]
  │                                │
  │                           DELIVERING
  │                           /         \
  │               [Giao thành công]  [Giao thất bại]
  │                       │                  │
  │                  COMPLETED      DELIVERY_FAILED
  │
  └─[Nhà hàng từ chối / User hủy]──► CANCELLED
```

---

## 💳 Luồng phân phối tiền khi giao hàng thành công

```
Tiền đặt hàng (từ ví User)
        │
        ▼
 Giữ trong hệ thống (khi đặt) 
        │
 [Shipper xác nhận giao thành công]
        │
        ├──► 95% ──► Ví Nhà hàng (Restaurant Wallet)
        │
        └──► 5%  ──► Ví Shipper (Shipper Wallet)
```

---

## 🏛️ Kiến trúc BCE áp dụng trong các biểu đồ

| Lớp | Ví dụ trong hệ thống |
|-----|---------------------|
| **Boundary** | React pages: `LoginPage`, `DashboardPage`, `FoodAndDrinkPage`, ... |
| **Control** | Service classes: `authService`, `walletService`, `shoppingService`, `shipperService`, ... |
| **Entity** | Backend API endpoints + Database |

---

## 📁 Cấu trúc thư mục

```
src/
├── usecaseUML/              ← Biểu đồ sequence PlantUML (.puml)
│   ├── UC01_DangNhap.puml
│   ├── UC02_DangKy.puml
│   ├── ...
│   └── UC22_AdminQuanLyDonHang.puml
│
└── usecase/                 ← Mô tả use case chi tiết (text)
    ├── ...
```

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

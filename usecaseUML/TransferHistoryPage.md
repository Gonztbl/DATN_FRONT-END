# Sequence Diagram – Transfer & History

## UC-68: Chuyển tiền qua SĐT (P2P Transfer)

```plantuml
@startuml UC68_ChuyểnTiềnSDT
actor User
boundary ":TransferHistoryUI" as UI
control ":TransferController" as CTRL
entity ":Wallet" as ENT
entity ":CSDL" as DB

User -> UI : 1: Nhập SĐT người nhận
activate UI

UI -> CTRL : 2: findUserByPhone(phone)
activate CTRL
CTRL -> DB : 3: GET /api/wallets/search?phone=...
activate DB
alt Không tìm thấy
    DB --> CTRL : 3.1: 404 Not Found
    CTRL --> UI : 3.2: User not found
    UI --> User : 3.3: Hiển thị lỗi
else Tìm thấy
    DB --> CTRL : 4.1: 200 OK {user}
    deactivate DB
    CTRL --> UI : 4.2: User Info (Name, Avatar)
    deactivate CTRL
    UI --> User : 5: Hiển thị người nhận, cho nhập tiền
end

User -> UI : 6: Nhập số tiền, nội dung, nhấn "Send Now"

UI -> CTRL : 7: transferP2P({toUser, amount, note})
activate CTRL

CTRL -> DB : 8: POST /api/wallets/transfer
activate DB

alt Số dư không đủ
    DB --> CTRL : 8.1: 400 Bad Request {message: INSUFFICIENT_BALANCE}
    CTRL --> UI : 8.2: Báo lỗi số dư
    UI --> User : 8.3: Thông báo lỗi
else Thành công
    DB --> CTRL : 9.1: 200 OK {success: true}
    deactivate DB
    CTRL -> ENT : 9.2: Cập nhật biến động (Local Update)
    activate ENT
    ENT --> CTRL : 9.3: Đã cập nhập
    deactivate ENT
    CTRL --> UI : 9.4: Thành công
    deactivate CTRL
    UI --> User : 10: Hiển thị "Chuyển tiền thành công", refresh lịch sử
end

deactivate UI
@enduml
```

## UC-69: Tra cứu lịch sử giao dịch

```plantuml
@startuml UC69_XemLichSuGiaoDich
actor User
boundary ":TransferHistoryUI" as UI
control ":HistoryController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

User -> UI : 1: Truy cập trang Lịch sử / Trang chính Ví
activate UI

UI -> CTRL : 2: getTransactionHistory(filters)
activate CTRL

CTRL -> DB : 3: GET /api/wallets/transactions?range=...&type=...
activate DB
DB --> CTRL : 4: 200 OK {transactions: [...], pagination}
deactivate DB

CTRL -> ENT : 5: Mapping danh sách giao dịch
activate ENT
ENT --> CTRL : 6: Trả về list
deactivate ENT

CTRL --> UI : 7: Hiển thị danh sách kết quả
deactivate CTRL

UI --> User : 8: Xem bảng giao dịch, nhấn vào item để xem chi tiết
deactivate UI
@enduml
```

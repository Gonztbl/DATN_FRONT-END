# Sequence Diagram – DashboardPage.jsx (Wallet)

## UC-23: Xem tổng quan ví điện tử

```plantuml
@startuml UC23_XemTongQuanVi
actor User
boundary ":WalletDashboardUI" as UI
control ":WalletController" as CTRL
entity ":Wallet" as ENTW
entity ":Card" as ENTC
entity ":Transaction" as ENTT
entity ":CSDL" as DB

User -> UI : 1: Truy cập trang Dashboard Wallet
activate UI

UI -> CTRL : 2: refreshData()
activate CTRL

CTRL -> DB : 3: GET /api/users/me (lấy walletId)
activate DB
DB --> CTRL : 4: 200 OK {user, wallet}
deactivate DB

CTRL -> DB : 5: Promise.allSettled([getBalance, getCards, getContacts, getTransferHistory, getWalletSummary])
activate DB
DB --> CTRL : 6: Kết quả các API
deactivate DB

CTRL -> ENTW : 7: Mapping Wallet (balance, monthlyChange)
activate ENTW
ENTW --> CTRL : 8: Wallet data
deactivate ENTW

CTRL -> ENTC : 9: Mapping Cards list
activate ENTC
ENTC --> CTRL : 10: Cards data
deactivate ENTC

CTRL -> ENTT : 11: Mapping Transactions (filter success only)
activate ENTT
ENTT --> CTRL : 12: Transactions + spending analytics
deactivate ENTT

CTRL --> UI : 13: Dashboard data (wallet, cards, transactions, chart, contacts)
deactivate CTRL

UI --> User : 14: Hiển thị Balance, Income/Expense, My Cards, Recent Transactions, Spending Chart
deactivate UI
@enduml
```

## UC-24: Chuyển tiền nhanh (Quick Transfer)

```plantuml
@startuml UC24_ChuyenTienNhanh
actor User
boundary ":WalletDashboardUI" as UI
control ":TransferController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

User -> UI : 1: Nhập SĐT người nhận hoặc chọn contact
activate UI

UI -> CTRL : 2: searchByPhone(phoneNumber)
activate CTRL
CTRL -> DB : 3: GET /api/wallets/search?phone=...
activate DB
DB --> CTRL : 4: 200 OK {wallets: [...]}
deactivate DB
CTRL --> UI : 5: Kết quả tìm kiếm
deactivate CTRL

UI --> User : 6: Hiển thị người nhận, cho phập nhập số tiền

User -> UI : 7: Nhập số tiền, nhấn "Chuyển tiền"

UI -> UI : 8: Validate (contact hợp lệ, amount > 0)

UI -> CTRL : 9: transfer({toUserId, amount, note})
activate CTRL

CTRL -> DB : 10: POST /api/wallets/transfer
activate DB

alt Chuyển tiền thất bại
    DB --> CTRL : 10.1: 4xx Error
    CTRL --> UI : 10.2: Trả về lỗi
    UI --> User : 10.3: Hiển thị "Chuyển tiền thất bại"
else Chuyển tiền thành công
    DB --> CTRL : 11.1: 200 OK {success: true}
    deactivate DB

    CTRL -> ENT : 11.2: Tạo Transaction (TRANSFER_OUT)
    activate ENT
    ENT --> CTRL : 11.3: Đã tạo
    deactivate ENT

    CTRL --> UI : 11.4: Thành công
    deactivate CTRL

    UI --> User : 12: Hiển thị "Chuyển tiền thành công", refresh dashboard
end

deactivate UI
@enduml
```

## UC-25: Quét QR chuyển tiền

```plantuml
@startuml UC25_QuetQRChuyenTien
actor User
boundary ":WalletDashboardUI" as UI
control ":QRController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

User -> UI : 1: Nhấn "Scan QR Code"
activate UI

UI --> User : 2: Mở modal upload ảnh QR
User -> UI : 3: Chọn ảnh QR từ thiết bị

UI -> CTRL : 4: readQrImage(file)
activate CTRL

CTRL -> DB : 5: POST /api/qr/read (multipart/form-data)
activate DB
DB --> CTRL : 6: 200 OK {valid, receiverName, walletId, amount}
deactivate DB

CTRL --> UI : 7: QR data
deactivate CTRL

UI -> UI : 8: Tự điền thông tin người nhận và số tiền
UI --> User : 9: Hiển thị form chuyển tiền đã điền sẵn

deactivate UI
@enduml
```

## UC-26: Thêm thẻ ngân hàng

```plantuml
@startuml UC26_ThemTheNganHang
actor User
boundary ":WalletDashboardUI" as UI
control ":CardController" as CTRL
entity ":Card" as ENT
entity ":CSDL" as DB

User -> UI : 1: Nhấn "+ Add" (thêm thẻ)
activate UI

UI --> User : 2: Hiển thị modal thêm thẻ

User -> UI : 3: Nhập cardNumber, holderName, expiryDate, cvv, bankName, type
User -> UI : 4: Nhấn "Thêm thẻ"

UI -> CTRL : 5: createCard(cardData)
activate CTRL

CTRL -> DB : 6: POST /api/cards
activate DB

alt Thêm thẻ thất bại
    DB --> CTRL : 6.1: 4xx Error
    CTRL --> UI : 6.2: Trả về lỗi
    UI --> User : 6.3: Hiển thị lỗi
else Thành công
    DB --> CTRL : 7.1: 201 Created
    deactivate DB

    CTRL -> ENT : 7.2: Tạo Card mới
    activate ENT
    ENT --> CTRL : 7.3: Đã tạo
    deactivate ENT

    CTRL --> UI : 7.4: Thành công
    deactivate CTRL

    UI --> User : 8: Đóng modal, refresh danh sách thẻ
end

deactivate UI
@enduml
```

## UC-27: Nạp tiền vào ví (Topup)

```plantuml
@startuml UC27_NapTienTopup
actor User
boundary ":WalletDashboardUI" as UI
control ":CardController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

User -> UI : 1: Nhấn "Top Up"
activate UI

UI --> User : 2: Hiển thị modal nạp tiền (chọn thẻ, nhập số tiền)

User -> UI : 3: Chọn thẻ nguồn, nhập số tiền
User -> UI : 4: Nhấn "Nạp tiền"

UI -> UI : 5: Validate (amount > 0, cardId hợp lệ)

UI -> CTRL : 6: depositFromCard({cardId, amount, description})
activate CTRL

CTRL -> DB : 7: POST /api/cards/deposit
activate DB

alt Nạp tiền thất bại
    DB --> CTRL : 7.1: Error / {status: FAILED}
    CTRL --> UI : 7.2: Trả về lỗi
    UI --> User : 7.3: Hiển thị "Nạp tiền thất bại"
else Thành công
    DB --> CTRL : 8.1: 200 OK {status: SUCCESS}
    deactivate DB

    CTRL -> ENT : 8.2: Tạo Transaction (DEPOSIT)
    activate ENT
    ENT --> CTRL : 8.3: Đã tạo
    deactivate ENT

    CTRL --> UI : 8.4: Thành công
    deactivate CTRL

    UI --> User : 9: Hiển thị "Nạp tiền thành công", đóng modal, refresh dashboard
end

deactivate UI
@enduml
```

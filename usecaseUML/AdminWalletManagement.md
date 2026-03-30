# Sequence Diagram – Admin Wallet Management

## UC-59: Xem danh sách ví điện tử

```plantuml
@startuml UC59_AdminXemVi
actor Admin
boundary ":AdminWalletUI" as UI
control ":WalletController" as CTRL
entity ":Wallet" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập trang Quản lý Ví
activate UI

UI -> CTRL : 2: getAllWallets()
activate CTRL

CTRL -> DB : 3: GET /api/admin/wallets
activate DB
DB --> CTRL : 4: 200 OK {wallets: [...]}
deactivate DB

CTRL -> ENT : 5: Mapping danh sách Wallet
activate ENT
ENT --> CTRL : 6: Trả về list
deactivate ENT

CTRL --> UI : 7: Danh sách ví hiển thị
deactivate CTRL

UI --> Admin : 8: Hiển thị bảng danh sách ví (ID, Balance, Status...)
deactivate UI
@enduml
```

## UC-60: Nạp tiền vào ví (Admin Topup)

```plantuml
@startuml UC60_AdminTopup
actor Admin
boundary ":AdminWalletUI" as UI
control ":WalletController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Chọn ví, nhấn "Topup"
activate UI

UI --> Admin : 2: Hiển thị Modal Topup
Admin -> UI : 3: Nhập số tiền (amount), nhấn "Confirm"

UI -> UI : 4: Validate (amount > 0)

UI -> CTRL : 5: adminTopup({walletId, amount})
activate CTRL

CTRL -> DB : 6: POST /api/admin/wallets/topup
activate DB

alt Topup thất bại
    DB --> CTRL : 6.1: 4xx/5xx Error
    CTRL --> UI : 6.2: Trả về lỗi
    UI --> Admin : 6.3: Hiển thị thông báo lỗi
else Thành công
    DB --> CTRL : 7.1: 200 OK {success: true, newBalance}
    deactivate DB

    CTRL -> ENT : 7.2: Tạo Transaction (ADMIN_TOPUP)
    activate ENT
    ENT --> CTRL : 7.3: Đã tạo
    deactivate ENT

    CTRL --> UI : 7.4: Thành công
    deactivate CTRL

    UI --> Admin : 8: Hiển thị "Nạp tiền thành công", refresh danh sách
end

deactivate UI
@enduml
```

## UC-61: Khóa/Mở khóa ví điện tử

```plantuml
@startuml UC61_AdminKhoaMoKhoaVi
actor Admin
boundary ":AdminWalletUI" as UI
control ":WalletController" as CTRL
entity ":Wallet" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Nhấn Toggle khóa/mở khóa ví
activate UI

UI -> CTRL : 2: toggleWalletStatus(walletId)
activate CTRL

alt Ví đang ACTIVE -> Khóa
    CTRL -> DB : 3a: PUT /api/admin/wallets/{id}/lock
    activate DB
    DB --> CTRL : 4a: 200 OK
    deactivate DB
else Ví đang LOCKED -> Mở khóa
    CTRL -> DB : 3b: PUT /api/admin/wallets/{id}/unlock
    activate DB
    DB --> CTRL : 4b: 200 OK
    deactivate DB
end

CTRL -> ENT : 5: Cập nhật trạng thái ví
activate ENT
ENT --> CTRL : 6: Đã cập nhật
deactivate ENT

CTRL --> UI : 7: Thành công
deactivate CTRL

UI --> Admin : 8: Cập nhật UI trạng thái mới
deactivate UI
@enduml
```

## UC-62: Xem lịch sử giao dịch hệ thống

```plantuml
@startuml UC62_AdminXemGiaoDich
actor Admin
boundary ":AdminTransactionUI" as UI
control ":TransactionController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập trang Lịch sử giao dịch hệ thống
activate UI

UI -> CTRL : 2: getAllTransactions()
activate CTRL

CTRL -> DB : 3: GET /api/admin/transactions
activate DB
DB --> CTRL : 4: 200 OK {transactions: [...]}
deactivate DB

CTRL -> ENT : 5: Mapping danh sách giao dịch
activate ENT
ENT --> CTRL : 6: Trả về list
deactivate ENT

CTRL --> UI : 7: Danh sách giao dịch hiển thị
deactivate CTRL

UI --> Admin : 8: Hiển thị bảng giao dịch (ID, Type, Amount, Status, User...)
deactivate UI
@enduml
```

## UC-63: Xem chi tiết giao dịch

```plantuml
@startuml UC63_AdminChiTietGiaoDich
actor Admin
boundary ":AdminTransactionUI" as UI
control ":TransactionController" as CTRL
entity ":Transaction" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Nhấn "View" tại một giao dịch
activate UI

UI -> CTRL : 2: getTransactionDetail(id)
activate CTRL

CTRL -> DB : 3: GET /api/admin/transactions/{id}
activate DB
DB --> CTRL : 4: 200 OK {detail}
deactivate DB

CTRL -> ENT : 5: Mapping chi tiết giao dịch
activate ENT
ENT --> CTRL : 6: Transaction data
deactivate ENT

CTRL --> UI : 7: Hiển thị Modal chi tiết
deactivate CTRL

UI --> Admin : 8: Xem Review chi tiết (Partner, Note, Direction...)
deactivate UI
@enduml
```

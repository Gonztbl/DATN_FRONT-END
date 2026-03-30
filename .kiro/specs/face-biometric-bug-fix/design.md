# Face Biometric Bug Fix - Thiết kế

## Overview

Ba bug liên quan đến tính năng xác thực khuôn mặt (face biometric) cần được sửa:

1. **Bug userId undefined**: `ProfilePage` truyền `user?.id` (undefined vì `/api/user/profile` không trả về field `id`) và `FaceManagementPage` truyền `authUser?.id` (undefined vì `authService.getCurrentUser()` không lưu field `id` từ login response) vào `faceService.listEmbeddings()`, khiến danh sách khuôn mặt không load được.

2. **Bug registerFace format sai**: `faceService.registerFace()` gửi `FormData` (multipart/form-data) trong khi backend `POST /api/face/register` yêu cầu JSON body `{image: "base64string"}`, gây lỗi 400 Bad Request.

3. **Bug verifyFace format sai**: `faceService.verifyFace()` cũng gửi `FormData` trong khi backend `POST /api/face/verify` yêu cầu JSON body `{image: "base64string"}`.

Chiến lược fix: minimal changes - chỉ sửa `faceService.js` để đổi format request, và sửa `authService.js` để lưu `id` vào user object khi login.

---

## Glossary

- **Bug_Condition (C)**: Điều kiện kích hoạt bug - userId là undefined/null hoặc request gửi sai format
- **Property (P)**: Hành vi mong muốn - userId được resolve thành công, request gửi đúng JSON format
- **Preservation**: Các hành vi hiện tại đang hoạt động đúng không được thay đổi
- **faceService**: Module tại `front-end/src/features/auth/services/faceService.js` xử lý tất cả API calls liên quan đến face biometric
- **authService**: Module tại `front-end/src/features/auth/services/authService.js` xử lý authentication, lưu user object vào localStorage
- **AuthContext**: Context tại `front-end/src/features/auth/context/AuthContext.jsx` cung cấp `user` object cho toàn app - lấy từ `authService.getCurrentUser()` (đọc localStorage)
- **_getUserId**: Helper trong `faceService` - nếu userId được truyền vào thì dùng luôn, nếu không thì gọi `/api/me` để lấy

---

## Bug Details

### Bug Condition

**Bug 1 - userId undefined:**

`ProfilePage` gọi `faceService.listEmbeddings(user?.id)` nhưng `user` được load từ `/api/user/profile` không có field `id`. `FaceManagementPage` gọi `faceService.listEmbeddings(authUser?.id)` nhưng `authUser` được lấy từ `AuthContext` → `authService.getCurrentUser()` → localStorage, và user object được lưu trong `authService.login()` không bao gồm field `id`.

**Formal Specification:**
```
FUNCTION isBugCondition_userId(userId)
  INPUT: userId được truyền vào faceService.listEmbeddings()
  OUTPUT: boolean

  RETURN userId = undefined OR userId = null
END FUNCTION
```

**Bug 2 & 3 - Request format sai:**

`registerFace()` và `verifyFace()` nhận `FormData` và gửi thẳng lên backend. Backend expect JSON `{image: "base64string"}`.

```
FUNCTION isBugCondition_requestFormat(request)
  INPUT: HTTP request từ registerFace() hoặc verifyFace()
  OUTPUT: boolean

  RETURN request.contentType = "multipart/form-data"
         AND request.endpoint IN ["/api/face/register", "/api/face/verify"]
END FUNCTION
```

### Examples

- `ProfilePage` load xong → `user = {fullName: "Nguyen Van A", email: "...", ...}` (không có `id`) → `faceService.listEmbeddings(undefined)` → fallback `/api/me` → nếu `/api/me` trả về `{id: 5, ...}` thì OK, nhưng nếu fail thì trả về `[]` → hiển thị "Chưa thiết lập"
- `FaceManagementPage` mount → `authUser = {username: "user1", email: "...", roles: [...]}` (không có `id`) → `faceService.listEmbeddings(undefined)` → tương tự trên
- User chụp ảnh khuôn mặt → `registerFace(formData)` → gửi `multipart/form-data` → backend trả về `400 Bad Request`
- User xác thực giao dịch → `verifyFace(formData)` → gửi `multipart/form-data` → backend trả về `400 Bad Request`

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Khi `userId` hợp lệ được truyền vào `listEmbeddings(userId)`, hệ thống KHÔNG gọi thêm `/api/me`
- `deleteEmbedding(embeddingId)` tiếp tục gọi `DELETE /api/face/{embeddingId}` đúng như hiện tại
- JWT token tiếp tục được đính kèm tự động vào tất cả requests qua `apiClient` interceptor
- Khi token 401, hệ thống tiếp tục redirect về login
- `generateEmbedding()` và `compareFaces()` không bị ảnh hưởng

**Scope:**
Tất cả inputs KHÔNG thuộc bug condition (userId hợp lệ, hoặc các API khác không phải register/verify) phải hoạt động y hệt như trước fix.

---

## Hypothesized Root Cause

1. **authService không lưu `id` vào user object**: Trong `authService.login()`, user object được build thủ công từ `response.data` nhưng bỏ sót field `id`/`userId`. Login response từ `/api/auth/login` có thể trả về `id` nhưng không được map vào object lưu localStorage.

2. **`/api/user/profile` không trả về `id`**: Backend endpoint này trả về profile data nhưng thiếu field `id` trong response. `ProfilePage` dùng `user?.id` mà không có fallback.

3. **faceService.registerFace() nhận FormData thay vì base64 string**: Caller (FaceRegisterPage hoặc tương tự) truyền `FormData` object vào `registerFace()`. Function cần extract base64 string từ FormData và gửi JSON thay vì forward FormData.

4. **faceService.verifyFace() tương tự**: Cùng vấn đề với `registerFace()`.

---

## Correctness Properties

Property 1: Bug Condition - userId Resolution

_For any_ call to `faceService.listEmbeddings(userId)` where `userId` is `undefined` or `null` (isBugCondition_userId returns true), the fixed `_getUserId()` function SHALL call `/api/me` and return a valid non-null, non-undefined integer id, allowing `listEmbeddings` to return the correct array of face embeddings.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Bug Condition - Register/Verify JSON Format

_For any_ call to `faceService.registerFace()` or `faceService.verifyFace()` where the current implementation sends multipart/form-data (isBugCondition_requestFormat returns true), the fixed functions SHALL send a JSON body `{image: "<base64string>"}` with `Content-Type: application/json` and query params `?userId=&pose=`, receiving a non-400 success response from the backend.

**Validates: Requirements 2.4**

Property 3: Preservation - Valid userId Passthrough

_For any_ call to `faceService.listEmbeddings(userId)` where `userId` is a valid non-null value (isBugCondition_userId returns false), the fixed `_getUserId()` SHALL return that same `userId` directly without calling `/api/me`, preserving the existing short-circuit behavior.

**Validates: Requirements 3.1**

Property 4: Preservation - Other faceService Methods Unchanged

_For any_ call to `faceService.deleteEmbedding()`, `faceService.generateEmbedding()`, or `faceService.compareFaces()`, the fixed code SHALL produce exactly the same HTTP requests and responses as the original code.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

---

## Fix Implementation

### Changes Required

**File 1**: `front-end/src/features/auth/services/authService.js`

**Function**: `login()`

**Specific Changes**:
1. **Thêm field `id` vào user object**: Khi build user object từ login response, thêm `id: response.data.id ?? response.data.userId` để AuthContext và FaceManagementPage có thể dùng `authUser?.id`.

---

**File 2**: `front-end/src/features/auth/services/faceService.js`

**Function**: `registerFace(formData)`

**Specific Changes**:
1. **Extract base64 từ FormData**: Lấy `image` field từ FormData (là File object hoặc base64 string), convert sang base64 string nếu cần.
2. **Đổi sang JSON body**: Thay vì gửi `formData` trực tiếp, gửi `{image: base64String}` với `Content-Type: application/json`.
3. **Giữ nguyên query params**: `?userId=&pose=` vẫn được gửi qua `config.params`.

**Function**: `verifyFace(formData)`

**Specific Changes**:
1. **Extract base64 từ FormData**: Tương tự `registerFace`.
2. **Đổi sang JSON body**: Gửi `{image: base64String}` thay vì FormData.

---

## Testing Strategy

### Validation Approach

Chiến lược hai giai đoạn: trước tiên chạy test trên code CHƯA FIX để xác nhận bug tồn tại (exploratory), sau đó verify fix hoạt động đúng và không gây regression.

### Exploratory Bug Condition Checking

**Goal**: Xác nhận bug tồn tại trên code chưa fix, confirm root cause analysis.

**Test Plan**: Mock `apiClient` và kiểm tra các call thực tế được gửi đi. Chạy trên code CHƯA FIX để thấy failure.

**Test Cases**:
1. **userId undefined test**: Gọi `faceService.listEmbeddings(undefined)` → verify `/api/me` được gọi (sẽ pass vì `_getUserId` đã có fallback, nhưng nếu `/api/me` fail thì trả về `[]`)
2. **authService missing id test**: Simulate login response có `id: 5` → verify user object trong localStorage có field `id` (sẽ FAIL trên code chưa fix vì `authService.login()` không map `id`)
3. **registerFace format test**: Gọi `faceService.registerFace(formData)` → verify request body là JSON `{image: "..."}` (sẽ FAIL vì hiện tại gửi FormData)
4. **verifyFace format test**: Gọi `faceService.verifyFace(formData)` → verify request body là JSON (sẽ FAIL)

**Expected Counterexamples**:
- `authService.login()` response có `id: 5` nhưng localStorage user object không có field `id`
- `registerFace()` gửi request với `Content-Type: multipart/form-data` thay vì `application/json`

### Fix Checking

**Goal**: Verify rằng sau khi fix, tất cả inputs thuộc bug condition đều cho kết quả đúng.

**Pseudocode:**
```
FOR ALL userId WHERE isBugCondition_userId(userId) DO
  id ← faceService._getUserId'(userId)
  ASSERT id ≠ undefined AND id ≠ null AND typeof id = "number"
END FOR

FOR ALL formData WHERE isBugCondition_requestFormat(formData) DO
  request ← captureRequest(faceService.registerFace'(formData))
  ASSERT request.contentType = "application/json"
  ASSERT JSON.parse(request.body).image IS string
  ASSERT request.params.userId IS defined
END FOR
```

### Preservation Checking

**Goal**: Verify rằng các inputs KHÔNG thuộc bug condition vẫn hoạt động y hệt.

**Pseudocode:**
```
FOR ALL userId WHERE NOT isBugCondition_userId(userId) DO
  ASSERT faceService._getUserId'(userId) = userId
  ASSERT apiClient.get('/api/me') WAS NOT called
END FOR

FOR ALL embeddingId DO
  ASSERT faceService.deleteEmbedding'(embeddingId) = faceService.deleteEmbedding(embeddingId)
END FOR
```

**Testing Approach**: Property-based testing phù hợp cho preservation checking vì có thể generate nhiều userId hợp lệ khác nhau (integers, strings) để verify không có regression.

**Test Cases**:
1. **Valid userId passthrough**: Truyền `userId = 42` → verify `/api/me` KHÔNG được gọi, trả về `42`
2. **deleteEmbedding preservation**: Gọi `deleteEmbedding(123)` → verify `DELETE /api/face/123` được gọi đúng
3. **JWT token preservation**: Verify tất cả requests vẫn có `Authorization: Bearer <token>` header

### Unit Tests

- Test `authService.login()` với mock response có `id` → verify user object trong localStorage có `id`
- Test `faceService._getUserId(undefined)` → verify gọi `/api/me` và trả về id
- Test `faceService._getUserId(42)` → verify KHÔNG gọi `/api/me`, trả về `42`
- Test `faceService.registerFace(formData)` → verify request là JSON với field `image`
- Test `faceService.verifyFace(formData)` → verify request là JSON với field `image`
- Test edge case: `formData` có `image` là File object → verify được convert sang base64

### Property-Based Tests

- Generate random valid userIds (positive integers) → verify `_getUserId(id)` luôn trả về chính `id` đó mà không gọi `/api/me`
- Generate random base64 strings → verify `registerFace` luôn gửi đúng string đó trong JSON body
- Generate random embeddingIds → verify `deleteEmbedding` luôn gọi đúng endpoint `DELETE /api/face/{id}`

### Integration Tests

- Test full flow: login → `authUser.id` có giá trị → `listEmbeddings(authUser.id)` gọi đúng endpoint
- Test full flow: chụp ảnh → `registerFace(formData)` → backend nhận JSON → trả về 200
- Test full flow: `ProfilePage` load → `user.id` undefined → fallback `/api/me` → `listEmbeddings` trả về đúng data

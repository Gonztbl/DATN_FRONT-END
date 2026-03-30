# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - userId Undefined & Request Format Bug
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bugs exist
  - **Scoped PBT Approach**: Scope to concrete failing cases:
    - Case A: `authService.login()` với response có `id: 5` → user object trong localStorage KHÔNG có field `id`
    - Case B: `faceService.registerFace(formData)` → request gửi `multipart/form-data` thay vì `application/json`
    - Case C: `faceService.verifyFace(formData)` → request gửi `multipart/form-data` thay vì `application/json`
  - Test A: Mock login response `{token: "...", id: 5, userName: "user1"}` → assert `JSON.parse(localStorage.getItem('user')).id === 5` (FAILS vì authService không map `id`)
  - Test B: Mock `apiClient.post` → gọi `registerFace(formData)` → assert request body là JSON với field `image` (FAILS vì gửi FormData)
  - Test C: Mock `apiClient.post` → gọi `verifyFace(formData)` → assert request body là JSON với field `image` (FAILS vì gửi FormData)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bugs exist)
  - Document counterexamples found:
    - "authService.login() với id:5 trong response → localStorage user không có field id"
    - "registerFace() gửi Content-Type: multipart/form-data thay vì application/json"
    - "verifyFace() gửi Content-Type: multipart/form-data thay vì application/json"
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Valid userId Passthrough & Other Methods Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - Observe: `faceService._getUserId(42)` trả về `42` và KHÔNG gọi `/api/me`
    - Observe: `faceService.deleteEmbedding(123)` gọi `DELETE /api/face/123` đúng
    - Observe: Tất cả requests có `Authorization: Bearer <token>` header
  - Write property-based tests:
    - Property: For all valid userId (positive integers), `_getUserId(userId)` returns same userId without calling `/api/me`
    - Property: For all embeddingId values, `deleteEmbedding(id)` calls `DELETE /api/face/{id}` exactly once
    - Property: `generateEmbedding()` và `compareFaces()` vẫn gửi FormData đúng như hiện tại
  - Verify tests PASS on UNFIXED code (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix face biometric bugs (authService userId + faceService request format)

  - [x] 3.1 Fix authService.login() - thêm field `id` vào user object
    - Trong `authService.login()`, thêm `id: response.data.id ?? response.data.userId` vào user object trước khi lưu localStorage
    - Đảm bảo `AuthContext` và `FaceManagementPage` có thể dùng `authUser?.id` sau khi login
    - _Bug_Condition: isBugCondition_userId(authUser?.id) where authUser.id = undefined (login response có id nhưng không được map)_
    - _Expected_Behavior: user object trong localStorage có field `id` với giá trị từ response.data.id ?? response.data.userId_
    - _Preservation: Tất cả fields khác trong user object (username, email, fullName, avatar, membership, roles, status, active, isActive) không thay đổi_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Fix faceService.registerFace() - đổi từ FormData sang JSON body
    - Extract `image` field từ FormData (File object hoặc base64 string)
    - Nếu là File object, convert sang base64 string bằng FileReader hoặc tương đương
    - Gửi JSON body `{image: base64String}` với `Content-Type: application/json`
    - Giữ nguyên query params `?userId=&pose=` qua `config.params`
    - _Bug_Condition: isBugCondition_requestFormat(request) where request.contentType = "multipart/form-data" AND endpoint = "/api/face/register"_
    - _Expected_Behavior: request.contentType = "application/json" AND JSON.parse(request.body).image IS string AND request.params.userId IS defined_
    - _Preservation: userId resolution logic (_getUserId) không thay đổi; query params vẫn được gửi đúng_
    - _Requirements: 2.4_

  - [x] 3.3 Fix faceService.verifyFace() - đổi từ FormData sang JSON body
    - Tương tự registerFace: extract `image` từ FormData, convert sang base64 nếu cần
    - Gửi JSON body `{image: base64String}` với `Content-Type: application/json`
    - Giữ nguyên query params `?userId=` qua `config.params`
    - _Bug_Condition: isBugCondition_requestFormat(request) where request.contentType = "multipart/form-data" AND endpoint = "/api/face/verify"_
    - _Expected_Behavior: request.contentType = "application/json" AND JSON.parse(request.body).image IS string_
    - _Preservation: userId resolution logic không thay đổi_
    - _Requirements: 2.4_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - userId Undefined & Request Format Bug
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied:
      - authService.login() lưu `id` vào user object
      - registerFace() gửi JSON body với field `image`
      - verifyFace() gửi JSON body với field `image`
    - **EXPECTED OUTCOME**: Tests PASS (confirms all 3 bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Valid userId Passthrough & Other Methods Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm: valid userId vẫn bypass `/api/me`, deleteEmbedding vẫn gọi đúng endpoint, JWT token vẫn được đính kèm
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Chạy toàn bộ test suite để đảm bảo không có regression
  - Verify: Property 1 (bug condition) PASS sau fix
  - Verify: Property 2 (preservation) PASS sau fix
  - Kiểm tra thủ công: login → FaceManagementPage hiển thị đúng danh sách khuôn mặt
  - Kiểm tra thủ công: đăng ký khuôn mặt mới không còn lỗi 400 Bad Request
  - Ensure all tests pass, ask the user if questions arise.

# ✅ Production Deployment Checklist

## 🔴 BẮT BUỘC - Phải làm trước khi deploy

### Frontend

- [x] ✅ Tạo file `vercel.json` để xử lý routing (tránh lỗi 404 khi F5)
- [x] ✅ Tạo file `public/_redirects` cho Netlify
- [ ] ⚠️ Cập nhật `.env.production` với URL backend thực tế
  ```env
  VITE_API_URL=https://your-actual-backend.onrender.com
  ```
- [ ] ⚠️ Kiểm tra không commit file `.env.production` vào Git
- [ ] ⚠️ Build thử nghiệm: `cd front-end && npm run build`
- [ ] ⚠️ Test build locally: `npm run preview`

### Backend

- [x] ✅ Cập nhật `WebConfig.java` để hỗ trợ dynamic CORS
- [ ] ⚠️ Thêm biến môi trường `ALLOWED_ORIGINS` trên server backend
  ```bash
  ALLOWED_ORIGINS=https://your-frontend.vercel.app
  ```
- [ ] ⚠️ Đảm bảo backend URL là HTTPS (không phải HTTP)
- [ ] ⚠️ Kiểm tra database connection string cho production
- [ ] ⚠️ Test API endpoints với Postman/curl

---

## 🟡 NÊN LÀM - Tránh lỗi runtime

### Code Quality

- [ ] ⚠️ Fix các lỗi ESLint nghiêm trọng (xem `front-end/lint_final.txt`)
  - Ưu tiên: Các biến `is not defined` (có thể gây crash)
  - Có thể bỏ qua: Các cảnh báo `is assigned but never used`
- [ ] ⚠️ Test các tính năng chính:
  - [ ] Login/Logout
  - [ ] Dashboard load data
  - [ ] Transfer money
  - [ ] Deposit/Withdraw
  - [ ] Transaction history

### Security

- [ ] ⚠️ Đảm bảo không có API keys/secrets trong code
- [ ] ⚠️ Kiểm tra file `.gitignore` đã bao gồm:
  ```
  .env
  .env.local
  .env.production
  ```
- [ ] ⚠️ Review CORS configuration - chỉ cho phép domain cần thiết

---

## 🟢 TỐT NẾU CÓ - Cải thiện UX

### Performance

- [ ] 💡 Implement code splitting với React.lazy() (xem `OPTIMIZATION_GUIDE.md`)
- [ ] 💡 Optimize images (compress, use WebP)
- [ ] 💡 Add loading states cho API calls
- [ ] 💡 Add error boundaries để catch React errors

### Monitoring

- [ ] 💡 Setup error tracking (Sentry, LogRocket)
- [ ] 💡 Setup analytics (Google Analytics, Vercel Analytics)
- [ ] 💡 Add health check endpoint trên backend: `/api/health`

### Documentation

- [x] ✅ Tạo `DEPLOYMENT_GUIDE.md`
- [x] ✅ Tạo `CORS_CONFIGURATION.md`
- [ ] 💡 Document API endpoints
- [ ] 💡 Create user manual

---

## 🧪 Testing Sau Khi Deploy

### 1. Functional Testing

- [ ] ⚠️ Test login với user thật
- [ ] ⚠️ Test tất cả routes (click vào từng menu)
- [ ] ⚠️ Test F5 (refresh) trên mỗi route
- [ ] ⚠️ Test trên nhiều trình duyệt (Chrome, Firefox, Safari)
- [ ] ⚠️ Test trên mobile (responsive)

### 2. Network Testing

- [ ] ⚠️ Mở DevTools → Network tab
- [ ] ⚠️ Kiểm tra không có lỗi CORS (màu đỏ)
- [ ] ⚠️ Kiểm tra API calls trả về đúng status code
- [ ] ⚠️ Kiểm tra không có Mixed Content warnings

### 3. Console Testing

- [ ] ⚠️ Mở DevTools → Console tab
- [ ] ⚠️ Kiểm tra không có lỗi JavaScript (màu đỏ)
- [ ] ⚠️ Cảnh báo (màu vàng) có thể chấp nhận được

### 4. Performance Testing

- [ ] 💡 Chạy Lighthouse audit (target: >80 điểm)
- [ ] 💡 Test tốc độ load trang đầu tiên
- [ ] 💡 Test với slow 3G network

---

## 🚨 Rollback Plan

Nếu có vấn đề sau khi deploy:

### Frontend (Vercel/Netlify)
```bash
# Vercel: Rollback về deployment trước
vercel rollback

# Netlify: Vào dashboard → Deploys → Click "Publish deploy" trên version cũ
```

### Backend (Render)
- Vào Render dashboard
- Chọn service → Manual Deploy → Deploy previous commit

---

## 📞 Emergency Contacts

- **Frontend Issues:** [Your Name] - [Email/Phone]
- **Backend Issues:** [Your Name] - [Email/Phone]
- **Database Issues:** [DBA Name] - [Email/Phone]

---

## 📝 Deployment Log Template

```
Date: YYYY-MM-DD HH:MM
Deployed by: [Your Name]
Environment: Production

Frontend:
- URL: https://_____.vercel.app
- Commit: [git commit hash]
- Build time: [X minutes]

Backend:
- URL: https://_____.onrender.com
- Commit: [git commit hash]
- Environment variables updated: [Yes/No]

Issues encountered: [None / List issues]
Rollback performed: [No / Yes - reason]

Post-deployment tests:
- [ ] Login works
- [ ] API calls successful
- [ ] No CORS errors
- [ ] No console errors
```

---

## 🎯 Success Criteria

Deploy được coi là thành công khi:

1. ✅ Người dùng có thể login
2. ✅ Dashboard hiển thị dữ liệu
3. ✅ Có thể thực hiện giao dịch (transfer/deposit/withdraw)
4. ✅ F5 (refresh) không bị lỗi 404
5. ✅ Không có lỗi CORS trong console
6. ✅ Không có lỗi JavaScript crash app

---

**Chúc bạn deploy thành công! 🚀**

*Lưu file này và tick vào các checkbox khi hoàn thành mỗi bước.*




<!-- PR for TN-27 pool optimization -->



<!-- Live test PR for task TN-27 -->


<!-- Live test PR for task TN-3 -->
# TestInboundTN — Demo Web Project cho TeamNexus GitHub Inbound Webhook

Dự án web mẫu (Zero-dependency Node.js & HTML5/CSS3/Vanilla JS) dùng để tạo GitHub Repository và kiểm thử toàn diện tính năng **Inbound Webhook (Giai đoạn 15)** của nền tảng **TeamNexus**.

---

## 1. Khởi chạy thử nghiệm cục bộ (Local)

Dự án sử dụng module HTTP tích hợp sẵn của Node.js (không cần tải thêm bất kỳ package nào):

```bash
# Chạy server
npm start

# Mở trình duyệt truy cập:
http://localhost:3000
```

---

## 2. Hướng dẫn tạo Repository trên GitHub và đẩy mã nguồn lên

### Bước 2.1: Tạo Git Repository cục bộ & Commit đầu tiên
Mở terminal tại thư mục `E:\TestInboundTN`:

```bash
cd E:\TestInboundTN
git init -b main
git add .
git commit -m "feat: initial commit for TeamNexus inbound demo"
```

### Bước 2.2: Tạo Repository mới trên GitHub
1. Truy cập [https://github.com/new](https://github.com/new).
2. Đặt tên repository, ví dụ: `test-inbound-tn` (chọn Public hoặc Private đều được).
3. Không cần tích chọn *"Add a README file"* vì ta đã có sẵn mã nguồn.
4. Nhấn **Create repository**.

### Bước 2.3: Đẩy mã nguồn lên GitHub
Thay `<YOUR_GITHUB_USERNAME>` bằng tài khoản GitHub của bạn:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/test-inbound-tn.git
git push -u origin main
```

---

## 3. Cấu hình Webhook trên TeamNexus & GitHub

### Bước 3.1: Bật tích hợp trên TeamNexus
1. Mở TeamNexus, truy cập vào **Workspace** của bạn (với vai trò *Manager* hoặc *Admin*).
2. Vào **Cài đặt không gian làm việc** (Workspace Settings) ➔ Chuyển sang tab **"Tích hợp (Slack / Discord / GitHub)"**.
3. Cuộn xuống mục **"Tích hợp GitHub Repository (Inbound Automation)"**:
   - Bật công tắc **"Kích hoạt tích hợp GitHub"**.
   - **Bảng mặc định nhận Issue:** Chọn bảng Kanban bạn muốn nhận thẻ tự động.
   - Bật các tùy chọn:
     - *Tự động chuyển cột khi PR mở / merge* (In Review / Done).
     - *Tự động tạo thẻ task từ GitHub Issue*.
     - *Đồng bộ bình luận hai chiều*.
   - Nhấn **"Lưu cấu hình"**.
4. **Lấy thông tin Webhook:**
   - Hệ thống sẽ hiển thị một thông báo màu vàng chứa **Webhook Secret (chỉ hiện 1 lần)**: Bấm **"Sao chép Secret"** và lưu lại.
   - Sao chép **Webhook Payload URL** (ví dụ dạng `https://<YOUR_HOST>/api/webhooks/github/<TOKEN_GUID>`).
   > *Lưu ý khi test local:* Nếu TeamNexus chạy ở `localhost:5000`, bạn cần sử dụng một công cụ tạo tunnel như `ngrok` (`ngrok http 5000`) hoặc `cloudflared` để GitHub có thể gửi webhook về máy của bạn.

### Bước 3.2: Thêm Webhook vào GitHub Repository
1. Trên GitHub, vào repository `test-inbound-tn` ➔ Chọn tab **Settings** ➔ Menu bên trái chọn **Webhooks**.
2. Nhấn nút **Add webhook**.
3. Điền cấu hình:
   - **Payload URL:** Dán `Webhook Payload URL` đã copy từ TeamNexus.
   - **Content type:** Chọn `application/json` *(bắt buộc)*.
   - **Secret:** Dán chuỗi `Webhook Secret` đã copy từ TeamNexus.
   - **Which events would you like to trigger this webhook?:**
     - Chọn **Let me select individual events**.
     - Tích chọn 3 sự kiện chính:
       1. ✅ **Issues**
       2. ✅ **Issue comments**
       3. ✅ **Pull requests**
   - Đảm bảo ô **Active** được tích chọn.
4. Bấm **Add webhook**. GitHub sẽ gửi 1 ping test (dấu tích xanh là thành công).

---

## 4. Năm kịch bản kiểm thử (Test Scenarios)

### Kịch bản 1: Mở GitHub Issue ➔ Tự động sinh Task trong TeamNexus
1. Vào tab **Issues** trên GitHub repo ➔ Nhấn **New issue**.
2. Tiêu đề: `[UI] Cải thiện giao diện responsive mobile`.
3. Nội dung: `Cần bổ sung breakpoint cho màn hình iPhone 15 và kiểm tra font chữ.`.
4. Nhấn **Submit new issue**.
5. **Kết quả kỳ vọng:**
   - Kiểm tra bảng Kanban của TeamNexus: Xuất hiện thẻ task mới trong cột mặc định.
   - Người tạo là bot `GitHub Bot`.
   - AI Jev tự động phân tích mức độ ưu tiên (Triage).

---

### Kịch bản 2: Đặt tên nhánh & Commit chứa mã Task
Giả sử thẻ task mới tạo ở trên có mã là `TN-1` (hoặc mã ngắn hiển thị trên thẻ):

```bash
# Tạo nhánh mới có chứa mã task
git checkout -b feature/TN-1-responsive-fix

# Thực hiện thay đổi nhỏ (ví dụ sửa file public/style.css) và commit
git add .
git commit -m "feat(ui): [TN-1] fix responsive header for mobile"

# Đẩy nhánh lên GitHub
git push -u origin feature/TN-1-responsive-fix
```

**Kết quả kỳ vọng:** Trong chi tiết thẻ task `TN-1` trên TeamNexus, xuất hiện liên kết tham chiếu tới Commit / Branch vừa đẩy.

---

### Kịch bản 3: Mở Pull Request ➔ Task tự chuyển sang "In Review"
1. Trên GitHub, mở Pull Request từ nhánh `feature/TN-1-responsive-fix` vào nhánh `main`.
2. Tiêu đề PR: `feat: TN-1 Mobile UI responsiveness`.
3. Bấm **Create pull request**.
4. **Kết quả kỳ vọng:** Thẻ task `TN-1` trên Kanban tự động nhảy từ cột đang làm sang cột **"In Review"** (nếu bảng có cấu hình cột này).

---

### Kịch bản 4: Hợp nhất (Merge) PR ➔ Task tự chuyển sang "Done"
1. Trên trang Pull Request ở GitHub, nhấn **Merge pull request** ➔ **Confirm merge**.
2. **Kết quả kỳ vọng:**
   - Thẻ `TN-1` trên TeamNexus tự động chuyển sang cột **Done**.
   - Trong lịch sử hoạt động (Activity Log) và `AiActionLog`, ghi nhận hành động di chuyển do `GitHub Bot` thực hiện, kèm bản ghi snapshot có thể ấn **Undo (Hoàn tác)** nếu cần.

---

### Kịch bản 5: Đồng bộ bình luận (Comments)
1. Thêm một bình luận vào Issue hoặc PR trên GitHub:
   - *"Đã kiểm thử trên mobile, chạy rất mượt!"*
2. **Kết quả kỳ vọng:** Bình luận xuất hiện gần như ngay lập tức trong phần Thảo luận của thẻ task trên TeamNexus kèm nhãn `via GitHub @<username>`.


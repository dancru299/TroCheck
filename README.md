# TroCheck

TroCheck là web app mobile-first giúp người thuê trọ kiểm tra nhanh tiền điện nước có bị tính cao bất thường không. Sản phẩm được build theo `TroCheck_PRD_v1.4_ShipEdition.docx`, ưu tiên trải nghiệm nhập liệu trong 30 giây và result card dễ chụp màn hình để gửi qua Zalo.

## Tính năng chính

- Tính tiền điện theo 3 kiểu thực tế nhà trọ:
  - Giá cố định theo kWh.
  - Bậc thang EVN 6 bậc + VAT.
  - Nhập tổng tiền điện chủ nhà thu.
- Tính tiền nước theo 3 kiểu:
  - Theo m3, có thể đối chiếu với bảng giá tham chiếu.
  - Theo đầu người.
  - Khoán cố định theo tháng/phòng.
- Tách riêng các khoản phụ như wifi, rác, gửi xe, vệ sinh, thang máy, khác.
- Result card hiển thị shock number, chênh lệch điện/nước, tổng khoản phụ, tổng tiền chủ nhà thu và tổng tiền theo giá tham chiếu.
- Copy mẫu tin nhắn Zalo lịch sự để hỏi lại chủ nhà.
- Lưu lịch sử trên thiết bị bằng `localStorage`, không cần backend.
- Có 2 trang SEO P1, sitemap, robots và OG image endpoint.

## Stack

- Framework: Next.js 16 App Router
- UI: React 19, Tailwind CSS 4
- Language: TypeScript
- Charts: Recharts
- Icons: Lucide React
- OG image: `next/og`
- Tests: Vitest
- E2E/manual QA: Playwright

## Chạy local

Yêu cầu:

- Node.js 22+
- npm 10+

Cài dependencies:

```bash
npm install
```

Chạy dev server:

```bash
npm run dev
```

Mở URL Next.js hiển thị trong terminal, thường là:

```text
http://localhost:3000
```

Chạy production local sau khi build:

```bash
npm run build
npm start
```

Nếu port `3000` đang bận:

```bash
npm run dev -- --port 3001
npm start -- --port 3001
```

## Scripts

```bash
npm test
```

Chạy unit tests cho logic tính điện, nước và tổng bill.

```bash
npm run typecheck
```

Kiểm tra TypeScript.

```bash
npm run lint
```

Kiểm tra ESLint.

```bash
npm run build
```

Build production. Warning về Edge runtime ở `/api/og` là bình thường vì route này render OG image bằng Edge.

## Cấu trúc thư mục

```text
app/
  page.tsx                         # Home app: form + result card
  layout.tsx                       # Root metadata/layout
  globals.css                      # Tailwind + global UI styles
  api/og/route.tsx                 # OG image endpoint
  result/page.tsx                  # Share result page
  gia-dien-phong-tro-hcm/page.tsx  # SEO page P1
  cach-tinh-dien-evn/page.tsx      # SEO page P1
  sitemap.ts
  robots.ts

src/
  components/
    TroCheckApp.tsx                # App shell + state orchestration
    ElectricForm.tsx               # Input form điện/nước/khoản phụ
    ResultCard.tsx                 # Shock number + summary
    BillExplainer.tsx              # Giải thích hóa đơn
    TrustSignals.tsx               # Nguồn giá + breakdown
    ZaloMessageModal.tsx           # Copy Zalo templates
    HistoryChart.tsx               # localStorage trend chart
    ConfidenceFooter.tsx
  data/
    electricRates.ts               # EVN 6 bậc, versioned
    waterRates.ts                  # HCM/HN water rates, versioned
  utils/
    calculateElectric.ts
    calculateWater.ts
    calculateBill.ts
    billExplainer.ts
    verdict.ts
    storage.ts
    format.ts
    tieredBill.ts
```

## Logic tính toán

### Điện

TroCheck luôn tính một mức tham chiếu theo EVN 6 bậc + VAT để so sánh.

Các kiểu chủ nhà thu tiền điện:

- `Giá cố định`: `số kWh * giá/kWh`.
- `Bậc thang`: chủ nhà thu đúng theo EVN 6 bậc + VAT, dùng cho trường hợp có đăng ký tạm trú/hợp đồng điện sinh hoạt hợp lệ.
- `Nhập tổng`: user nhập trực tiếp tổng tiền điện trên bill.

Chênh lệch điện là:

```text
tiền điện chủ nhà thu - tiền điện EVN tham chiếu
```

### Nước

Nếu user chọn `Theo m3`, TroCheck đối chiếu với bảng giá nước tham chiếu của thành phố.

Nếu user chọn `Theo đầu người` hoặc `Khoán`, app vẫn cộng đúng số tiền nước vào tổng chủ nhà thu, nhưng không tự kết luận chênh lệch nước vì thiếu số m3 thực tế để đối chiếu bảng giá.

### Khoản phụ

Các khoản như wifi, rác, gửi xe, vệ sinh, thang máy và khác được tách riêng khỏi chênh lệch điện nước.

```text
tổng chủ nhà thu = tiền điện + tiền nước + khoản phụ
chênh lệch điện nước = chênh lệch điện + chênh lệch nước có thể đối chiếu
```

## Nguồn giá đang dùng

- Điện sinh hoạt EVN theo Quyết định 1279/QĐ-BCT, hiệu lực 10/05/2025.
- Nước TP.HCM theo bảng công bố 2026.
- Nước Hà Nội theo HAWACOM 2026.

Các nguồn này được khai báo trong:

- `src/data/electricRates.ts`
- `src/data/waterRates.ts`

Khi giá thay đổi, cập nhật data file và thêm/sửa unit tests tương ứng.

## SEO routes

- `/gia-dien-phong-tro-hcm`
- `/cach-tinh-dien-evn`
- `/sitemap.xml`
- `/robots.txt`
- `/api/og`

## QA trước khi ship

Chạy tối thiểu:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

Nên kiểm tra thủ công trên mobile width khoảng `390px`:

- Nhập/xóa tiền không nhảy về `0`.
- Tiền format kiểu Việt Nam: `100000` -> `100.000`.
- Chuyển 3 mode điện.
- Chuyển 3 mode nước.
- Thêm/xóa nhiều khoản phụ.
- Result card không overflow và vẫn dễ chụp màn hình.
- Copy Zalo modal mở/đóng bình thường.
- Lưu lịch sử xong reload vẫn còn dữ liệu.

## Deployment

Khuyến nghị deploy trên Vercel.

Không cần biến môi trường cho MVP hiện tại. App không có backend, không gửi dữ liệu hóa đơn lên server và chỉ lưu lịch sử trong `localStorage` của trình duyệt.

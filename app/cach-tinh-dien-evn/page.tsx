import type { Metadata } from "next";
import Link from "next/link";
import { EVN_RESIDENTIAL_RATE } from "@/src/data/electricRates";
import { formatVnd } from "@/src/utils/format";

export const metadata: Metadata = {
  title: "Cách tính điện EVN 6 bậc cho phòng trọ",
  description:
    "Hướng dẫn đọc bậc thang điện sinh hoạt EVN và tự kiểm tra tiền điện phòng trọ bằng số kWh.",
  alternates: {
    canonical: "/cach-tinh-dien-evn"
  }
};

export default function EvnGuidePage() {
  return (
    <main className="bg-white">
      <article className="prose mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1>Cách tính điện EVN 6 bậc cho phòng trọ</h1>
        <p>
          Điện sinh hoạt không lấy một giá duy nhất nhân toàn bộ kWh. EVN chia theo bậc: phần dùng
          trong bậc thấp tính giá thấp, phần vượt lên bậc sau mới tính giá cao hơn.
        </p>
        <ol>
          <li>Lấy số điện tháng này trừ số điện tháng trước.</li>
          <li>Chia kWh vào từng bậc sinh hoạt.</li>
          <li>Cộng tiền từng bậc rồi cộng VAT điện 10%.</li>
          <li>So sánh với phần tiền điện chủ nhà thu, sau khi tách phí dịch vụ.</li>
        </ol>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2>Ví dụ nhanh</h2>
          <p>
            Nếu dùng 150 kWh: 50 kWh đầu tính {formatVnd(1984)}/kWh, 50 kWh tiếp theo tính{" "}
            {formatVnd(2050)}/kWh, 50 kWh còn lại tính {formatVnd(2380)}/kWh, sau đó cộng VAT.
          </p>
        </div>
        <p>
          TroCheck tự chạy phép tính này khi bạn nhập số kWh. Mục tiêu là cho ra số chênh lệch dễ
          chụp màn hình và đủ breakdown để nhắn lại lịch sự.
        </p>
        <p>
          Nguồn giá:{" "}
          <a href={EVN_RESIDENTIAL_RATE.sourceUrl} rel="noreferrer" target="_blank">
            {EVN_RESIDENTIAL_RATE.sourceName}
          </a>
          .
        </p>
        <Link className="cta-link" href="/">
          Tính tiền điện phòng mình
        </Link>
      </article>
    </main>
  );
}

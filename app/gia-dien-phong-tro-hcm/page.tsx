import type { Metadata } from "next";
import Link from "next/link";
import { EVN_RESIDENTIAL_RATE } from "@/src/data/electricRates";
import { WATER_RATES } from "@/src/data/waterRates";
import { formatVnd } from "@/src/utils/format";

export const metadata: Metadata = {
  title: "Giá điện phòng trọ HCM: chủ trọ tính 4k/kWh có đúng không?",
  description:
    "Tra nhanh giá điện sinh hoạt EVN và cách kiểm tra tiền điện phòng trọ tại TP.HCM bằng TroCheck.",
  alternates: {
    canonical: "/gia-dien-phong-tro-hcm"
  }
};

export default function HcmElectricPage() {
  return (
    <main className="bg-white">
      <ArticleShell>
        <h1>Giá điện phòng trọ HCM: chủ trọ tính 4k/kWh có đúng không?</h1>
        <p>
          Nếu phòng trọ đang bị tính 4.000đ/kWh, câu trả lời ngắn là: mức này thường cao hơn nhiều
          so với bậc sinh hoạt thấp, nhưng cần tính theo tổng kWh, VAT và các khoản phí riêng trước
          khi kết luận.
        </p>
        <RateTable />
        <p>
          TroCheck dùng biểu giá EVN hiện hành từ {EVN_RESIDENTIAL_RATE.effectiveFrom}. Với TP.HCM,
          phần nước được tính theo định mức m3/người/tháng và bảng giá nước 2026.
        </p>
        <ul>
          <li>Nhập số điện, số nước, số người trong phòng.</li>
          <li>Nhập đơn giá/kWh hoặc tổng tiền điện chủ nhà thu.</li>
          <li>Tách phí dịch vụ để tránh tính nhầm thành tiền điện nước.</li>
        </ul>
        <SourceBlock />
        <Link className="cta-link" href="/">
          Kiểm tra hóa đơn của bạn
        </Link>
      </ArticleShell>
    </main>
  );
}

function RateTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3">Bậc điện sinh hoạt</th>
            <th className="px-4 py-3 text-right">Đơn giá trước VAT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {EVN_RESIDENTIAL_RATE.tiers.map((tier) => (
            <tr key={tier.label}>
              <td className="px-4 py-3 font-bold text-slate-900">{tier.label}</td>
              <td className="px-4 py-3 text-right number-tabular">{formatVnd(tier.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceBlock() {
  const hcm = WATER_RATES.hcm;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
      Nguồn:{" "}
      <a href={EVN_RESIDENTIAL_RATE.sourceUrl} rel="noreferrer" target="_blank">
        {EVN_RESIDENTIAL_RATE.sourceName}
      </a>{" "}
      và{" "}
      <a href={hcm.sourceUrl} rel="noreferrer" target="_blank">
        {hcm.sourceName}
      </a>
      .
    </div>
  );
}

function ArticleShell({ children }: { children: React.ReactNode }) {
  return <article className="prose mx-auto max-w-3xl px-4 py-10 sm:py-14">{children}</article>;
}

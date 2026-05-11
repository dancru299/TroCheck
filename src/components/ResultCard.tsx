"use client";

import type { BillCalculation } from "@/src/utils/calculateBill";
import { buildExplainerLines } from "@/src/utils/billExplainer";
import { formatPercent, formatVnd } from "@/src/utils/format";
import { Camera, Clipboard, Save } from "lucide-react";
import BillExplainer from "./BillExplainer";
import ConfidenceFooter from "./ConfidenceFooter";
import TrustSignals from "./TrustSignals";

type ResultCardProps = {
  calculation: BillCalculation;
  onCopyZalo: () => void;
  onSave: () => void;
  onShare: () => void;
  saved: boolean;
};

export default function ResultCard({
  calculation,
  onCopyZalo,
  onSave,
  onShare,
  saved
}: ResultCardProps) {
  const toneClass =
    calculation.verdict.level === "ok" ? "text-emerald-700" : "text-red-600";
  const badgeClass =
    calculation.verdict.level === "ok"
      ? "bg-emerald-50 text-emerald-800"
      : calculation.verdict.level === "warning"
        ? "bg-amber-100 text-amber-900"
        : "bg-red-50 text-red-700";
  const headline =
    calculation.verdict.level === "ok"
      ? "Hóa đơn gần mức sinh hoạt thông thường"
      : "Bạn đang trả cao hơn mức sinh hoạt";
  const explainerLines = buildExplainerLines(
    calculation.electric,
    calculation.water,
    calculation.extraChargesTotal
  );

  return (
    <section
      className="result-card-shadow rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8"
      id="result-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">Kết quả ước tính</p>
          <h2 className="mt-2 text-xl font-black leading-tight text-slate-950 sm:text-2xl">
            {headline}
          </h2>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          Cập nhật: {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>

      <div className="mx-auto my-6 max-w-[30rem] text-center">
        <p
          className={`number-tabular text-[3rem] font-black leading-none sm:text-[4.75rem] ${toneClass}`}
        >
          {formatVnd(calculation.difference, true)}
        </p>
        <p className={`mt-2 text-xl font-black ${toneClass}`}>
          {calculation.standardTotal > 0 ? `(~ ${formatPercent(calculation.percentOver)})` : ""}
        </p>
        <p
          className={`mx-auto mt-4 inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-extrabold ${badgeClass}`}
        >
          {calculation.verdict.shortLabel}
        </p>
        <p className="mt-3 text-sm font-bold text-slate-600">{calculation.verdict.title}</p>
      </div>

      <div className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <ComparisonBlock
          label="Tổng theo giá tham chiếu"
          tone="green"
          total={calculation.standardTotal}
          detail={`Điện ${formatVnd(calculation.electric.standardTotal)} · ${
            calculation.water.referenceAvailable
              ? `Nước ${formatVnd(calculation.water.standardTotal)}`
              : "Nước cần số m3 để đối chiếu"
          }`}
        />
        <span className="mx-auto hidden size-12 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-500 sm:flex">
          VS
        </span>
        <ComparisonBlock
          label="Tổng tiền chủ nhà thu"
          tone="red"
          total={calculation.ownerGrandTotal}
          detail={`Điện ${formatVnd(calculation.electric.ownerTotal)} · Nước ${formatVnd(
            calculation.water.ownerTotal
          )} · Khoản phụ ${formatVnd(calculation.extraChargesTotal)}`}
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <h3 className="mb-3 text-base font-black text-slate-950">Tóm tắt đối chiếu</h3>
        <div className="divide-y divide-slate-200">
          <SummaryRow label="Chênh lệch điện" tone={calculation.electric.difference} value={calculation.electric.difference} />
          <SummaryRow
            label="Chênh lệch nước"
            note={
              calculation.water.referenceAvailable
                ? undefined
                : "Chưa có số m3 để so giá tham chiếu"
            }
            tone={calculation.water.difference}
            value={calculation.water.difference}
          />
          <SummaryRow
            label="Tổng khoản phụ đã tách riêng"
            neutral
            value={calculation.extraChargesTotal}
          />
          <SummaryRow label="Tổng tiền chủ nhà thu" neutral value={calculation.ownerGrandTotal} />
          <SummaryRow label="Tổng tiền theo giá tham chiếu" neutral value={calculation.standardTotal} />
        </div>
      </div>

      <div className="mt-5">
        <BillExplainer lines={explainerLines} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <ActionButton icon={<Camera size={19} />} label="Chụp / Share" primary onClick={onShare} />
        <ActionButton icon={<Clipboard size={19} />} label="Copy Zalo" onClick={onCopyZalo} />
        <ActionButton icon={<Save size={19} />} label={saved ? "Đã lưu" : "Lưu"} onClick={onSave} />
      </div>

      <div className="mt-5">
        <TrustSignals calculation={calculation} />
      </div>

      <div className="mt-5">
        <ConfidenceFooter />
      </div>
    </section>
  );
}

function ComparisonBlock({
  label,
  tone,
  total,
  detail
}: {
  label: string;
  tone: "green" | "red";
  total: number;
  detail: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-extrabold text-slate-700">{label}</p>
      <p
        className={`number-tabular mt-2 text-2xl font-black ${
          tone === "green" ? "text-emerald-700" : "text-red-600"
        }`}
      >
        {formatVnd(total)}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">{detail}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
  neutral,
  note
}: {
  label: string;
  value: number;
  tone?: number;
  neutral?: boolean;
  note?: string;
}) {
  const amountClass = neutral
    ? "text-slate-950"
    : (tone ?? value) > 20_000
      ? "text-red-600"
      : "text-emerald-700";

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 py-3">
      <span>
        <span className="block text-sm font-extrabold text-slate-800">{label}</span>
        {note ? <span className="block text-xs leading-5 text-slate-500">{note}</span> : null}
      </span>
      <span className={`number-tabular whitespace-nowrap text-sm font-black sm:text-base ${amountClass}`}>
        {neutral ? formatVnd(value) : formatVnd(value, true)}
      </span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  primary,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`focus-ring flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-black transition ${
        primary
          ? "border-emerald-800 bg-emerald-700 text-white hover:bg-emerald-800"
          : "border-slate-300 bg-white text-slate-800 hover:border-emerald-700 hover:text-emerald-800"
      }`}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

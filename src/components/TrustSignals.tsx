"use client";

import { EVN_RESIDENTIAL_RATE } from "@/src/data/electricRates";
import { WATER_RATES } from "@/src/data/waterRates";
import type { BillCalculation } from "@/src/utils/calculateBill";
import { formatKwh, formatM3, formatVnd } from "@/src/utils/format";
import { ChevronDown, ExternalLink } from "lucide-react";

type TrustSignalsProps = {
  calculation: BillCalculation;
};

export default function TrustSignals({ calculation }: TrustSignalsProps) {
  const waterRate = WATER_RATES[calculation.water.city];

  return (
    <details className="group rounded-lg border border-slate-200 bg-slate-50/80">
      <summary className="focus-ring flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-extrabold text-slate-900">
        Nguồn giá và breakdown
        <ChevronDown className="transition group-open:rotate-180" size={18} />
      </summary>
      <div className="space-y-4 border-t border-slate-200 px-4 py-4 text-sm text-slate-600">
        <div className="grid gap-3 sm:grid-cols-2">
          <SourceLink
            label={EVN_RESIDENTIAL_RATE.sourceName}
            url={EVN_RESIDENTIAL_RATE.sourceUrl}
            date={`Hiệu lực ${EVN_RESIDENTIAL_RATE.effectiveFrom}`}
          />
          <SourceLink label={waterRate.sourceName} url={waterRate.sourceUrl} date={waterRate.note} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <BreakdownTable
            title={`Điện ${formatKwh(calculation.electric.kwh)}`}
            rows={calculation.electric.breakdown}
            total={calculation.electric.standardTotal}
            footer={`VAT điện: ${formatVnd(calculation.electric.vat)}`}
          />
          <BreakdownTable
            title={
              calculation.water.referenceAvailable
                ? `Nước ${formatM3(calculation.water.m3)}`
                : "Nước chưa có số m3"
            }
            rows={calculation.water.breakdown}
            total={calculation.water.standardTotal}
            footer={waterRate.quotaPerPerson ? `Định mức theo ${calculation.water.residents} người` : ""}
            emptyText={
              calculation.water.referenceAvailable
                ? undefined
                : "Chưa có số m3 nên TroCheck không đối chiếu nước theo bảng giá."
            }
          />
        </div>
      </div>
    </details>
  );
}

function SourceLink({ label, url, date }: { label: string; url: string; date: string }) {
  return (
    <a
      className="focus-ring flex min-h-12 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-emerald-600 hover:text-emerald-800"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      <span>
        <span className="block font-extrabold">{label}</span>
        <span className="block text-xs text-slate-500">{date}</span>
      </span>
      <ExternalLink size={16} />
    </a>
  );
}

function BreakdownTable({
  title,
  rows,
  total,
  footer,
  emptyText
}: {
  title: string;
  rows: BillCalculation["electric"]["breakdown"];
  total: number;
  footer: string;
  emptyText?: string;
}) {
  return (
    <div>
      <h3 className="mb-2 font-extrabold text-slate-950">{title}</h3>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2 font-bold">Bậc</th>
              <th className="px-3 py-2 text-right font-bold">SL</th>
              <th className="px-3 py-2 text-right font-bold">Tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={`${row.label}-${row.usage}`}>
                  <td className="px-3 py-2">{row.label}</td>
                  <td className="number-tabular px-3 py-2 text-right">{row.usage.toFixed(1)}</td>
                  <td className="number-tabular px-3 py-2 text-right font-bold">
                    {formatVnd(row.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={3}>
                  {emptyText ?? "Chưa có dữ liệu breakdown."}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2 text-xs text-slate-500" colSpan={2}>
                {footer}
              </td>
              <td className="number-tabular px-3 py-2 text-right font-black text-slate-950">
                {formatVnd(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

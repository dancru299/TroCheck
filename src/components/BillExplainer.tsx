import type { ExplainerLine } from "@/src/utils/billExplainer";
import { formatVnd } from "@/src/utils/format";
import { Bolt, Droplet, Receipt } from "lucide-react";

type BillExplainerProps = {
  lines: ExplainerLine[];
};

const ICONS: Record<string, React.ReactNode> = {
  electric: <Bolt size={22} fill="#f5b301" strokeWidth={2.4} />,
  water: <Droplet size={22} fill="#38bdf8" strokeWidth={2.2} />,
  service: <Receipt size={22} strokeWidth={2.2} />
};

export default function BillExplainer({ lines }: BillExplainerProps) {
  return (
    <div className="space-y-1">
      <h2 className="mb-3 text-lg font-black text-slate-950">Giải thích hóa đơn</h2>
      <div className="divide-y divide-slate-200">
        {lines.map((line) => (
          <div className="grid grid-cols-[2rem_1fr_auto] gap-3 py-3" key={line.id}>
            <span className="mt-0.5 text-slate-800">{ICONS[line.id]}</span>
            <span>
              <span className="block text-sm font-extrabold text-slate-950 sm:text-base">
                {line.label}
              </span>
              <span className="block text-xs leading-5 text-slate-500 sm:text-sm">{line.detail}</span>
            </span>
            <span
              className={`number-tabular whitespace-nowrap text-sm font-black sm:text-base ${
                line.id === "service"
                  ? "text-slate-950"
                  : line.amount > 20_000
                    ? "text-red-600"
                    : "text-emerald-700"
              }`}
            >
              {line.id === "service" ? formatVnd(line.amount) : formatVnd(line.amount, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

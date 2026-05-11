import { ShieldCheck } from "lucide-react";

export default function ConfidenceFooter() {
  return (
    <div className="flex items-start gap-2 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500 sm:text-sm">
      <ShieldCheck className="mt-0.5 shrink-0 text-emerald-700" size={18} strokeWidth={2.4} />
      <p>
        Ước tính theo giá sinh hoạt EVN · Đã trừ phí dịch vụ bạn nhập · Chênh lệch có thể do hợp
        đồng riêng
      </p>
    </div>
  );
}

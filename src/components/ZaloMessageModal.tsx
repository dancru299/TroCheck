"use client";

import type { BillCalculation } from "@/src/utils/calculateBill";
import { formatVnd } from "@/src/utils/format";
import { Check, Copy, MessageCircle, X } from "lucide-react";
import { useMemo, useState } from "react";

type ZaloMessageModalProps = {
  calculation: BillCalculation;
  open: boolean;
  onClose: () => void;
};

export default function ZaloMessageModal({ calculation, open, onClose }: ZaloMessageModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messages = useMemo(() => buildMessages(calculation), [calculation]);

  if (!open) {
    return null;
  }

  const copyMessage = async (message: string, index: number) => {
    await navigator.clipboard.writeText(message);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/48 p-3 sm:items-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <MessageCircle size={21} strokeWidth={2.4} />
            </span>
            <h2 className="text-lg font-black text-slate-950">Copy tin nhắn Zalo</h2>
          </div>
          <button
            aria-label="Đóng"
            className="focus-ring flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
            type="button"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-3">
          {messages.map((message, index) => (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3" key={message}>
              <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{message}</p>
              <button
                className="focus-ring mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-black text-white hover:bg-blue-700"
                type="button"
                onClick={() => copyMessage(message, index)}
              >
                {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
                {copiedIndex === index ? "Đã copy" : "Copy mẫu này"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildMessages(calculation: BillCalculation) {
  const diff = formatVnd(calculation.difference, true);
  const standard = formatVnd(calculation.standardTotal);
  const owner = formatVnd(calculation.ownerComparableTotal);

  return [
    `Mình vừa tự check tiền điện nước tháng này. Theo giá sinh hoạt thì khoảng ${standard}, còn phần điện nước mình bị thu là ${owner}, chênh ${diff}. Bạn xem lại giúp mình cách tính với nhé.`,
    `Cho mình hỏi lại bill tháng này một chút nha. Mình check theo EVN/giá nước địa phương thì phần điện nước đang lệch khoảng ${diff}. Có khoản nào tính theo hợp đồng riêng thì bạn gửi giúp mình để mình đối chiếu.`
  ];
}

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ElectricForm from "@/src/components/ElectricForm";
import ResultCard from "@/src/components/ResultCard";
import ZaloMessageModal from "@/src/components/ZaloMessageModal";
import type { BillInput } from "@/src/utils/calculateBill";
import { calculateBill } from "@/src/utils/calculateBill";
import { formatVnd } from "@/src/utils/format";
import { readHistory, saveHistoryEntry, type HistoryEntry } from "@/src/utils/storage";
import { Bolt, Check, HelpCircle, History, Menu, X } from "lucide-react";

const HistoryChart = dynamic(() => import("@/src/components/HistoryChart"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
      Đang tải lịch sử...
    </div>
  )
});

const DEFAULT_INPUT: BillInput = {
  city: "hn",
  electricKwh: 150,
  electricMode: "fixed-price",
  ownerElectricUnitPrice: 4500,
  ownerElectricTotal: 675000,
  waterMode: "metered",
  waterM3: 15,
  residents: 2,
  ownerWaterPerPersonPrice: 80000,
  ownerWaterTotal: 100000,
  extraCharges: [
    {
      id: "default-wifi",
      name: "wifi",
      amount: 100000
    }
  ]
};

export default function TroCheckApp() {
  const [input, setInput] = useState<BillInput>(DEFAULT_INPUT);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [zaloOpen, setZaloOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const calculation = useMemo(() => calculateBill(input), [input]);

  useEffect(() => {
    const timer = window.setTimeout(() => setHistory(readHistory()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  const updateInput = (next: BillInput) => {
    setInput(next);
    setSaved(false);
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const saveCurrent = () => {
    const next = saveHistoryEntry(input, calculation);
    setHistory(next);
    setSaved(true);
    showToast("Đã lưu vào lịch sử trên thiết bị");
  };

  const shareCurrent = async () => {
    const shareUrl = new URL("/result", window.location.origin);
    shareUrl.searchParams.set("amount", Math.round(calculation.difference).toString());
    shareUrl.searchParams.set("level", calculation.verdict.level);

    const text = `TroCheck: hóa đơn đang lệch ${formatVnd(calculation.difference, true)} so với giá sinh hoạt.`;

    if (navigator.share) {
      await navigator.share({
        title: "Kết quả TroCheck",
        text,
        url: shareUrl.toString()
      });
      return;
    }

    await navigator.clipboard.writeText(`${text} ${shareUrl.toString()}`);
    showToast("Đã copy link kết quả");
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link className="focus-ring flex items-center gap-2 rounded-lg" href="/">
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Bolt size={24} fill="currentColor" strokeWidth={2.2} />
            </span>
            <span className="text-2xl font-black text-slate-950">
              <span className="text-emerald-700">Tro</span>Check
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-extrabold text-slate-600 md:flex">
            <a className="focus-ring rounded-lg px-3 py-2 text-emerald-800" href="#kiem-tra">
              Kiểm tra
            </a>
            <a className="focus-ring rounded-lg px-3 py-2 hover:text-slate-950" href="#lich-su">
              Lịch sử
            </a>
            <Link
              className="focus-ring rounded-lg px-3 py-2 hover:text-slate-950"
              href="/cach-tinh-dien-evn"
            >
              Hướng dẫn
            </Link>
            <Link
              className="focus-ring rounded-lg px-3 py-2 hover:text-slate-950"
              href="/gia-dien-phong-tro-hcm"
            >
              Giá điện trọ
            </Link>
          </nav>

          <button
            aria-label="Menu"
            className="focus-ring flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            type="button"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {mobileNavOpen ? (
          <nav className="grid border-t border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-700 md:hidden">
            <a className="focus-ring rounded-lg px-3 py-3" href="#kiem-tra" onClick={() => setMobileNavOpen(false)}>
              Kiểm tra
            </a>
            <a className="focus-ring rounded-lg px-3 py-3" href="#lich-su" onClick={() => setMobileNavOpen(false)}>
              Lịch sử
            </a>
            <Link className="focus-ring rounded-lg px-3 py-3" href="/cach-tinh-dien-evn">
              Hướng dẫn
            </Link>
            <Link className="focus-ring rounded-lg px-3 py-3" href="/gia-dien-phong-tro-hcm">
              Giá điện trọ
            </Link>
          </nav>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[26rem_1fr] lg:gap-8 lg:py-8">
        <div className="lg:sticky lg:top-24 lg:self-start" id="kiem-tra">
          <ElectricForm onChange={updateInput} value={input} />
        </div>

        <div className="space-y-6">
          <ResultCard
            calculation={calculation}
            saved={saved}
            onCopyZalo={() => setZaloOpen(true)}
            onSave={saveCurrent}
            onShare={shareCurrent}
          />

          <section className="grid gap-4 lg:grid-cols-[1fr_20rem]" id="lich-su">
            <HistoryChart entries={history} />
            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-emerald-700" size={21} strokeWidth={2.4} />
                <h2 className="text-base font-black text-slate-950">Cách đọc nhanh</h2>
              </div>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <li className="flex gap-2">
                  <Check className="mt-1 shrink-0 text-emerald-700" size={16} />
                  <span>Số đỏ lớn là phần chênh lệch điện nước sau khi tách khoản phụ.</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-1 shrink-0 text-emerald-700" size={16} />
                  <span>Breakdown dùng để đối chiếu với hóa đơn gốc trước khi nhắn chủ nhà.</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-1 shrink-0 text-emerald-700" size={16} />
                  <span>Lịch sử chỉ lưu trên máy bạn, không gửi về server.</span>
                </li>
              </ul>
            </aside>
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>TroCheck ước tính theo bảng giá công khai, không thay thế hóa đơn chính thức.</p>
          <div className="flex flex-wrap gap-3 font-bold">
            <span className="inline-flex items-center gap-1">
              <History size={15} />
              localStorage
            </span>
          </div>
        </div>
      </footer>

      <ZaloMessageModal
        calculation={calculation}
        open={zaloOpen}
        onClose={() => setZaloOpen(false)}
      />

      {toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </main>
  );
}

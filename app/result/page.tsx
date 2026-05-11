import Link from "next/link";
import type { Metadata } from "next";
import { formatVnd } from "@/src/utils/format";

export const metadata: Metadata = {
  title: "Kết quả kiểm tra hóa đơn",
  description: "Kết quả chia sẻ từ TroCheck."
};

type ResultPageProps = {
  searchParams: Promise<{
    amount?: string;
    level?: string;
  }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const amount = Number(params.amount ?? 0);
  const isOk = params.level === "ok" || amount <= 20_000;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <section className="result-card-shadow w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
        <p className="text-sm font-black text-emerald-700">TroCheck</p>
        <h1 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
          {isOk ? "Hóa đơn gần mức sinh hoạt" : "Hóa đơn đang cao hơn mức sinh hoạt"}
        </h1>
        <p
          className={`number-tabular mt-6 text-5xl font-black sm:text-7xl ${
            isOk ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {formatVnd(amount, true)}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
          Đây là kết quả chia sẻ. Mở TroCheck để nhập hóa đơn của bạn và xem breakdown theo từng bậc.
        </p>
        <Link
          className="focus-ring mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-black text-white hover:bg-emerald-800"
          href="/"
        >
          Check phòng mình
        </Link>
      </section>
    </main>
  );
}

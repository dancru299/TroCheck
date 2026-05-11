"use client";

import type { HistoryEntry } from "@/src/utils/storage";
import { formatVnd } from "@/src/utils/format";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type HistoryChartProps = {
  entries: HistoryEntry[];
};

export default function HistoryChart({ entries }: HistoryChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const data = entries
    .slice()
    .reverse()
    .map((entry, index) => ({
      label: `L${index + 1}`,
      amount: Math.round(entry.difference),
      date: new Date(entry.createdAt).toLocaleDateString("vi-VN")
    }));

  useEffect(() => {
    const element = chartRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setChartWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm leading-6 text-slate-500">
        Lưu một kết quả để thấy xu hướng các tháng.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-slate-950">Lịch sử trên thiết bị</h2>
        <span className="text-xs font-bold text-slate-500">{data.length}/12 lần lưu</span>
      </div>
      <div className="h-52" ref={chartRef}>
        {chartWidth > 0 ? (
          <LineChart
            data={data}
            height={208}
            margin={{ top: 8, right: 12, bottom: 0, left: 4 }}
            width={chartWidth}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis dataKey="label" tick={{ fill: "#667085", fontSize: 12 }} />
            <YAxis tick={{ fill: "#667085", fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip
              contentStyle={{
                border: "1px solid #d9dee3",
                borderRadius: 8,
                boxShadow: "0 12px 30px rgba(16, 24, 40, 0.12)"
              }}
              formatter={(value) => [formatVnd(Number(value), true), "Chênh lệch"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
            />
            <Line
              activeDot={{ r: 6 }}
              dataKey="amount"
              dot={{ r: 4 }}
              stroke="#d71920"
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        ) : null}
      </div>
    </div>
  );
}

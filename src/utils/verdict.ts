export type VerdictLevel = "ok" | "warning" | "high";

export type Verdict = {
  level: VerdictLevel;
  title: string;
  shortLabel: string;
  detail: string;
};

export function getVerdict(difference: number, standardTotal: number): Verdict {
  const percent = standardTotal > 0 ? (difference / standardTotal) * 100 : 0;

  if (difference <= 20_000 || percent <= 5) {
    return {
      level: "ok",
      title: "Gần mức sinh hoạt thông thường",
      shortLabel: "Ổn",
      detail: "Chênh lệch nhỏ, có thể đến từ làm tròn, VAT hoặc phí phụ thu riêng."
    };
  }

  if (difference <= 180_000 || percent <= 30) {
    return {
      level: "warning",
      title: `Cao hơn giá sinh hoạt thông thường ${Math.round(percent)}%`,
      shortLabel: "Cần xem lại",
      detail: "Nên đối chiếu lại cách tính và các khoản phí đã tách riêng."
    };
  }

  return {
    level: "high",
    title: `Cao hơn nhiều so với giá sinh hoạt thông thường ${Math.round(percent)}%`,
    shortLabel: "Cao bất thường",
    detail: "Khoản chênh lệch đủ lớn để bạn nên hỏi lại bằng số liệu cụ thể."
  };
}

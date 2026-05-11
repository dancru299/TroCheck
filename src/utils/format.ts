export function clampNumber(value: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function roundVnd(value: number) {
  return Math.round(clampNumber(value, Number.MIN_SAFE_INTEGER));
}

export function formatVnd(value: number, signed = false) {
  const rounded = roundVnd(value);
  const sign = signed && rounded > 0 ? "+" : "";

  return `${sign}${rounded.toLocaleString("vi-VN")}đ`;
}

export function formatVndInput(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return Math.round(value).toLocaleString("vi-VN");
}

export function parseVndInput(value: string) {
  const digits = value.replace(/\D/g, "");

  return digits ? Number(digits) : 0;
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value)}%`;
}

export function formatKwh(value: number) {
  return `${trimDecimal(value)} kWh`;
}

export function formatM3(value: number) {
  return `${trimDecimal(value)} m3`;
}

export function trimDecimal(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value) ? value.toString() : value.toFixed(1).replace(/\.0$/, "");
}

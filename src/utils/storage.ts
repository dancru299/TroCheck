import type { BillCalculation, BillInput } from "./calculateBill";

export type HistoryEntry = {
  id: string;
  createdAt: string;
  input: BillInput;
  difference: number;
  standardTotal: number;
  ownerComparableTotal: number;
  verdictLevel: BillCalculation["verdict"]["level"];
};

const STORAGE_KEY = "trocheck:v1:history";
const MAX_HISTORY_ITEMS = 12;

export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY_ITEMS)));
}

export function createHistoryEntry(input: BillInput, calculation: BillCalculation): HistoryEntry {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    difference: calculation.difference,
    standardTotal: calculation.standardTotal,
    ownerComparableTotal: calculation.ownerComparableTotal,
    verdictLevel: calculation.verdict.level
  };
}

export function saveHistoryEntry(input: BillInput, calculation: BillCalculation) {
  const next = [createHistoryEntry(input, calculation), ...readHistory()].slice(0, MAX_HISTORY_ITEMS);
  writeHistory(next);
  return next;
}

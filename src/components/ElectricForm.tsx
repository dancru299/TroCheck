"use client";

import {
  EXTRA_CHARGE_LABELS,
  type BillInput,
  type ExtraCharge,
  type ExtraChargeName
} from "@/src/utils/calculateBill";
import { formatVnd, formatVndInput, parseVndInput } from "@/src/utils/format";
import { Bolt, Home, Landmark, Plus, ReceiptText, Trash2, Users, Waves } from "lucide-react";

type ElectricFormProps = {
  value: BillInput;
  onChange: (next: BillInput) => void;
};

type NumericFieldProps = {
  label: string;
  value: number;
  unit?: string;
  min?: number;
  step?: number;
  hint?: string;
  placeholder?: string;
  onChange: (value: number) => void;
};

type MoneyFieldProps = {
  label?: string;
  value: number;
  unit?: string;
  hint?: string;
  placeholder?: string;
  onChange: (value: number) => void;
};

const EXTRA_CHARGE_OPTIONS = Object.entries(EXTRA_CHARGE_LABELS) as Array<
  [ExtraChargeName, string]
>;

export default function ElectricForm({ value, onChange }: ElectricFormProps) {
  const extraChargesTotal = value.extraCharges.reduce((total, charge) => total + charge.amount, 0);

  const setValue = <K extends keyof BillInput>(key: K, fieldValue: BillInput[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const updateExtraCharge = (id: string, patch: Partial<ExtraCharge>) => {
    setValue(
      "extraCharges",
      value.extraCharges.map((charge) => (charge.id === id ? { ...charge, ...patch } : charge))
    );
  };

  const addExtraCharge = () => {
    setValue("extraCharges", [
      ...value.extraCharges,
      {
        id: crypto.randomUUID(),
        name: "wifi",
        amount: 0
      }
    ]);
  };

  const removeExtraCharge = (id: string) => {
    setValue(
      "extraCharges",
      value.extraCharges.filter((charge) => charge.id !== id)
    );
  };

  return (
    <section className="phone-shell rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">TroCheck</p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950">Tính nhanh 30 giây</h1>
        </div>
        <span className="flex size-11 items-center justify-center rounded-full bg-emerald-700 text-white">
          <ReceiptText size={22} strokeWidth={2.4} />
        </span>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-900">Tỉnh / Thành phố</span>
          <select
            className="focus-ring h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-950"
            value={value.city}
            onChange={(event) => setValue("city", event.target.value as BillInput["city"])}
          >
            <option value="hcm">TP.HCM</option>
            <option value="hn">Hà Nội</option>
          </select>
        </label>

        <FormGroup title="Chủ nhà tính điện theo">
          <div className="grid grid-cols-3 gap-2">
            <SegmentButton
              active={value.electricMode === "fixed-price"}
              icon={<Home size={18} />}
              label="Giá cố định"
              onClick={() => setValue("electricMode", "fixed-price")}
            />
            <SegmentButton
              active={value.electricMode === "tiered"}
              icon={<Bolt size={18} />}
              label="Bậc thang"
              onClick={() => setValue("electricMode", "tiered")}
            />
            <SegmentButton
              active={value.electricMode === "total-bill"}
              icon={<Landmark size={18} />}
              label="Nhập tổng"
              onClick={() => setValue("electricMode", "total-bill")}
            />
          </div>
        </FormGroup>

        <NumericField
          label="Số điện"
          placeholder="VD: 150"
          step={1}
          unit="kWh"
          value={value.electricKwh}
          onChange={(next) => setValue("electricKwh", next)}
        />

        {value.electricMode === "fixed-price" ? (
          <MoneyField
            label="Giá điện cố định"
            placeholder="VD: 4.500"
            unit="đ/kWh"
            value={value.ownerElectricUnitPrice}
            onChange={(next) => setValue("ownerElectricUnitPrice", next)}
          />
        ) : null}

        {value.electricMode === "tiered" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
            TroCheck tính phần chủ nhà thu theo EVN 6 bậc + VAT. Trường hợp này thường áp dụng khi
            phòng có đăng ký tạm trú/hợp đồng điện sinh hoạt hợp lệ.
          </div>
        ) : null}

        {value.electricMode === "total-bill" ? (
          <MoneyField
            label="Tổng tiền điện chủ nhà thu"
            placeholder="VD: 675.000"
            unit="đ"
            value={value.ownerElectricTotal}
            onChange={(next) => setValue("ownerElectricTotal", next)}
          />
        ) : null}

        <FormGroup title="Chủ nhà tính nước theo">
          <div className="grid grid-cols-3 gap-2">
            <SegmentButton
              active={value.waterMode === "metered"}
              icon={<Waves size={17} />}
              label="m3"
              onClick={() => setValue("waterMode", "metered")}
            />
            <SegmentButton
              active={value.waterMode === "per-person"}
              icon={<Users size={17} />}
              label="Đầu người"
              onClick={() => setValue("waterMode", "per-person")}
            />
            <SegmentButton
              active={value.waterMode === "flat"}
              icon={<Landmark size={17} />}
              label="Khoán"
              onClick={() => setValue("waterMode", "flat")}
            />
          </div>
        </FormGroup>

        {value.waterMode === "metered" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumericField
                label="Số nước"
                placeholder="VD: 15"
                step={1}
                unit="m3"
                value={value.waterM3}
                onChange={(next) => setValue("waterM3", next)}
              />
              <NumericField
                label="Số người"
                hint={value.city === "hcm" ? "Dùng cho định mức nước TP.HCM." : undefined}
                placeholder="VD: 2"
                step={1}
                value={value.residents}
                onChange={(next) => setValue("residents", Math.max(1, Math.round(next)))}
              />
            </div>
            <MoneyField
              label="Tiền nước chủ nhà thu"
              hint="Nếu chủ nhà gộp nước vào bill tổng, nhập phần bạn ước tách ra được."
              placeholder="VD: 100.000"
              unit="đ"
              value={value.ownerWaterTotal}
              onChange={(next) => setValue("ownerWaterTotal", next)}
            />
          </>
        ) : null}

        {value.waterMode === "per-person" ? (
          <div className="grid grid-cols-2 gap-3">
            <NumericField
              label="Số người"
              placeholder="VD: 2"
              step={1}
              value={value.residents}
              onChange={(next) => setValue("residents", Math.max(1, Math.round(next)))}
            />
            <MoneyField
              label="Giá nước/người"
              placeholder="VD: 80.000"
              unit="đ"
              value={value.ownerWaterPerPersonPrice}
              onChange={(next) => setValue("ownerWaterPerPersonPrice", next)}
            />
          </div>
        ) : null}

        {value.waterMode === "flat" ? (
          <MoneyField
            label="Tiền nước khoán/tháng"
            placeholder="VD: 150.000"
            unit="đ"
            value={value.ownerWaterTotal}
            onChange={(next) => setValue("ownerWaterTotal", next)}
          />
        ) : null}

        <FormGroup
          title="Khoản phụ tách riêng"
          subtitle="Wifi, rác, gửi xe... không tính vào chênh lệch điện nước."
        >
          <div className="space-y-2">
            {value.extraCharges.map((charge) => (
              <div
                className="grid grid-cols-[1fr_2.75rem] gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2"
                key={charge.id}
              >
                <select
                  aria-label="Tên khoản phụ"
                  className="focus-ring h-12 rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-slate-900"
                  value={charge.name}
                  onChange={(event) =>
                    updateExtraCharge(charge.id, { name: event.target.value as ExtraChargeName })
                  }
                >
                  {EXTRA_CHARGE_OPTIONS.map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  aria-label={`Xóa khoản ${EXTRA_CHARGE_LABELS[charge.name]}`}
                  className="focus-ring flex h-12 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-red-400 hover:text-red-600"
                  type="button"
                  onClick={() => removeExtraCharge(charge.id)}
                >
                  <Trash2 size={18} />
                </button>
                <div className="col-span-2">
                  <MoneyField
                    ariaLabel={`Số tiền ${EXTRA_CHARGE_LABELS[charge.name]}`}
                    compact
                    placeholder="VD: 100.000"
                    unit="đ"
                    value={charge.amount}
                    onChange={(next) => updateExtraCharge(charge.id, { amount: next })}
                  />
                </div>
              </div>
            ))}

            <button
              className="focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-700 bg-emerald-50 px-4 text-sm font-black text-emerald-800 hover:bg-emerald-100"
              type="button"
              onClick={addExtraCharge}
            >
              <Plus size={18} />
              Thêm khoản
            </button>

            {extraChargesTotal > 0 ? (
              <p className="text-right text-sm font-black text-slate-900">
                Tổng khoản phụ: {formatVnd(extraChargesTotal)}
              </p>
            ) : null}
          </div>
        </FormGroup>
      </div>
    </section>
  );
}

function FormGroup({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-slate-900">{title}</span>
      {subtitle ? <p className="mb-2 text-xs leading-5 text-slate-500">{subtitle}</p> : null}
      {children}
    </div>
  );
}

function SegmentButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`focus-ring flex h-12 items-center justify-center gap-2 rounded-lg border px-2 text-sm font-bold transition ${
        active
          ? "border-emerald-700 bg-emerald-50 text-emerald-800"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
      }`}
      type="button"
      onClick={onClick}
    >
      {icon}
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

function NumericField({
  label,
  value,
  unit,
  min = 0,
  step = 1,
  hint,
  placeholder,
  onChange
}: NumericFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-900">{label}</span>
      <span className="relative block">
        <input
          className="focus-ring h-12 w-full rounded-lg border border-slate-300 bg-white px-3 pr-16 text-base font-semibold text-slate-950"
          inputMode="decimal"
          min={min}
          placeholder={placeholder}
          step={step}
          type="number"
          value={Number.isFinite(value) && value > 0 ? value : ""}
          onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
        />
        {unit ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
            {unit}
          </span>
        ) : null}
      </span>
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

function MoneyField({
  label,
  value,
  unit = "đ",
  hint,
  placeholder = "VD: 100.000",
  onChange,
  compact,
  ariaLabel
}: MoneyFieldProps & { compact?: boolean; ariaLabel?: string }) {
  const input = (
    <span className="relative block">
      <input
        aria-label={ariaLabel}
        className="focus-ring h-12 w-full rounded-lg border border-slate-300 bg-white px-3 pr-14 text-base font-semibold text-slate-950"
        inputMode="numeric"
        placeholder={placeholder}
        type="text"
        value={formatVndInput(value)}
        onChange={(event) => onChange(parseVndInput(event.target.value))}
      />
      {unit ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
          {unit}
        </span>
      ) : null}
    </span>
  );

  if (compact) {
    return input;
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-900">{label}</span>
      {input}
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

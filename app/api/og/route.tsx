import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = Number(searchParams.get("amount") ?? 287000);
  const level = searchParams.get("level") ?? "high";
  const isOk = level === "ok" || amount <= 20_000;
  const displayAmount = `${amount > 0 ? "+" : ""}${Math.round(amount).toLocaleString("vi-VN")}đ`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f5f7f8",
          padding: 72,
          fontFamily: "Arial, sans-serif",
          color: "#111827"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "2px solid #d9dee3",
            borderRadius: 28,
            background: "#ffffff",
            padding: 52
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 68,
                height: 68,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
                background: "#047a34",
                color: "#fff",
                fontSize: 44,
                fontWeight: 900
              }}
            >
              ⚡
            </div>
            <div style={{ fontSize: 56, fontWeight: 900 }}>
              <span style={{ color: "#047a34" }}>Tro</span>Check
            </div>
          </div>

          <div>
            <div style={{ fontSize: 42, fontWeight: 800 }}>
              {isOk ? "Hóa đơn gần mức sinh hoạt" : "Bạn đang trả cao hơn mức sinh hoạt"}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 112,
                lineHeight: 1,
                color: isOk ? "#047a34" : "#d71920",
                fontWeight: 900
              }}
            >
              {displayAmount}
            </div>
          </div>

          <div style={{ color: "#667085", fontSize: 30 }}>
            Ước tính theo giá sinh hoạt EVN · HCM · Hà Nội
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}

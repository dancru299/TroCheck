import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trocheck.vn"),
  title: {
    default: "TroCheck - Kiểm tra hóa đơn phòng trọ",
    template: "%s | TroCheck"
  },
  description:
    "Kiểm tra nhanh tiền điện nước phòng trọ theo giá sinh hoạt EVN, Hà Nội và TP.HCM. Kết quả rõ trong 30 giây.",
  applicationName: "TroCheck",
  openGraph: {
    title: "TroCheck - Kiểm tra hóa đơn phòng trọ",
    description:
      "Nhập số điện nước và khoản chủ nhà thu để biết hóa đơn có cao bất thường không.",
    url: "https://trocheck.vn",
    siteName: "TroCheck",
    locale: "vi_VN",
    type: "website",
    images: ["/api/og"]
  },
  twitter: {
    card: "summary_large_image",
    title: "TroCheck - Kiểm tra hóa đơn phòng trọ",
    description: "Check tiền điện nước phòng trọ trong 30 giây.",
    images: ["/api/og"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#047a34"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

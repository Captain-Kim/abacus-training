import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "주산 트레이닝",
  description: "덧셈/뺄셈/곱셈/나눗셈 암산 속도·정확도 훈련",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}

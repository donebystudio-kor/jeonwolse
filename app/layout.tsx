import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>",
  },
  title: "전월세 진단기 - 내 전월세, 적정가일까?",
  description:
    "국토교통부 실거래가 데이터 기반으로 아파트 전월세 적정가를 진단해보세요. 내 전월세가 비싼지, 적정한지 한눈에 확인할 수 있습니다.",
  keywords: "전월세, 적정가, 실거래가, 아파트, 전세, 월세, 진단, 부동산",
  openGraph: {
    title: "전월세 진단기 - 내 전월세, 적정가일까?",
    description:
      "국토교통부 실거래가 데이터 기반으로 아파트 전월세 적정가를 진단해보세요. 내 전월세가 비싼지, 적정한지 한눈에 확인할 수 있습니다.",
    url: "https://jeonwolse-drab.vercel.app",
    type: "website",
    locale: "ko_KR",
    siteName: "전월세",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZFRLJNV7JT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZFRLJNV7JT');
          `}
        </Script>
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}

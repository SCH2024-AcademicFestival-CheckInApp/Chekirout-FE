import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "CHEKIROUT",
  description:
    "순천향대학교 SW/AI FESTIVAL 내가 만든 학술제 앱 경진대회 출품을 위해 제작된 출석체크 PWA 어플리케이션입니다.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords:
    "순천향대학교, SW/AI FESTIVAL, 학술제, 앱 경진대회, 출석체크, Chekirout",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#235698" }],
  authors: [
    {
      name: "Team 체키라웃",
      url: "https://github.com/SCH2024-AcademicFestival-CheckInApp",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    {
      rel: "icon",
      url: "assets/icon192.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

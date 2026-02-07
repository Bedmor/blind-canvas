import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "~/components/Header";

export const metadata: Metadata = {
  title: "Kör Kolektif Tuval - Blind Canvas",
  description:
    "Dijital Zarif Ceset oyunu. Resmin tamamını görmeden birlikte çizin.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${geist.variable}`}>
      <body className="noise-bg min-h-screen bg-gray-950 text-white antialiased">
        <Header />
        <div className="relative z-10 pt-16">{children}</div>
      </body>
    </html>
  );
}

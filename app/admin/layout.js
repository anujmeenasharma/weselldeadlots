import { Montserrat } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata = {
  title: { default: "Website admin", template: "%s · Website admin" },
  robots: { index: false, follow: false },
};

// The admin panel has its own root layout: no site navbar, footer, analytics or translation scripts.
export default function AdminRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} bg-slate-100 text-slate-900 antialiased`}>{children}</body>
    </html>
  );
}

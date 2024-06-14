import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Formula 1 api",
  description:
    "This is the website for the (unofficial) Formula 1 api. Race results, practice results, qualifying, starting grids... from 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={font.className + " text-zinc-100 bg-zinc-950"}>
        {children}
      </body>
    </html>
  );
}

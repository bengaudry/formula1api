import type { Metadata } from "next";
import NextLink from "next/link"
import { Inter } from "next/font/google";
import "./globals.css";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className + " text-zinc-100 bg-zinc-950"}>
        {children}
      </body>
    </html>
  );
}

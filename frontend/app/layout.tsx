import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./root_layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "İhtiyaç Listesi",
  description: "İhtiyaç listelerinizi yönetmek için bir araç",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col bg-background`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

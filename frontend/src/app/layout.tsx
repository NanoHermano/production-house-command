import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Production House — Command Center",
  description: "AI Agent Factory Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

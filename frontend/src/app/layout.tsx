import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Ledger — Employee Leave Management",
  description: "Request, track, and review employee leave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col paper-texture">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

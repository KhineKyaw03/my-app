import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Payroll / Time Clock",
  description: "Employees can clock in and clock out using a web app.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

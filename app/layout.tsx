export const metadata = {
  title: "Payroll – Clock In/Out",
  description: "Simple payroll time tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Apply Tailwind utilities directly here */}
      <body className="min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

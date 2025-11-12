import "./ui/global.css";
import type { ReactNode } from "react";
import { SidebarNav } from "./ui/SidebarNav";

export const metadata = {
  title: "My Landing Page",
  description: "Landing page with sidebar navigation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <SidebarNav />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 bg-white border-b">
            <div className="text-lg font-semibold">Dashboard</div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

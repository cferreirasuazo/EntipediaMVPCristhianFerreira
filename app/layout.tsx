import "./ui/global.css";
import React from "react";
import type { ReactNode } from "react";
import { SidebarNav } from "./ui/SidebarNav";
import { Header } from "./ui/Header";

export const metadata = {
  title: "My Landing Page",
  description: "Landing page with sidebar and header",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <SidebarNav />

        {/* Right side: header + page content */}
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

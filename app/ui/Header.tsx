"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="h-16 w-full border-b bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-3">
        {/* Replace this with your generated logo */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={60}
          className="object-contain"
        />
        <span className="text-lg font-semibold tracking-tight">My Company</span>
      </Link>

      {/* Right: Placeholder for future actions */}
      <div className="flex items-center gap-4">
        {/* Add buttons or menus here later */}
        <span className="text-sm text-gray-600">Welcome back!</span>
      </div>
    </header>
  );
}

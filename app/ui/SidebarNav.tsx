"use client";
import React from "react";
import Link from "next/link";
import { FolderArchive, Users, FolderKanban, HomeIcon } from "lucide-react";
import {
  NavigationMenu,
  navigationMenuTriggerStyle,
} from "components/ui/navigation-menu";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";

export function SidebarNav() {
  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col p-4">
      {/* Navigation */}
      <NavigationMenu orientation="vertical" className="flex-1">
        <ul className="flex flex-col space-y-2">
          <SidebarItem href="/" icon={<HomeIcon size={16} />} label="Home" />
          <SidebarItem
            href="/archives"
            icon={<FolderArchive size={16} />}
            label="Archives"
          />
          <SidebarItem
            href="/clients"
            icon={<Users size={16} />}
            label="Clients"
          />
          <SidebarItem
            href="/projects"
            icon={<FolderKanban size={16} />}
            label="Projects"
          />
        </ul>
      </NavigationMenu>
    </aside>
  );
}

function SidebarItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={`
            ${navigationMenuTriggerStyle()} 
            w-full flex items-center gap-2 
            px-3 py-2 rounded-md
            text-sm font-medium
            hover:bg-gray-100
            transition-colors
          `}
        >
          {icon}
          {label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

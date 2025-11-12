"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { FolderArchive, Users, FolderKanban, HomeIcon } from "lucide-react";

export function NavigationMenuMain() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap">
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/" className="flex items-center gap-2">
              <HomeIcon size={16} />
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Archives */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <FolderArchive size={16} />
            Archives
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-2 p-3">
              <ListItem href="/archives" title="All Archives">
                View all archived items and records.
              </ListItem>
              <ListItem href="/archives/reports" title="Reports">
                Access archived reports and documents.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Clients */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <Users size={16} />
            Clients
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-2 p-3">
              <ListItem href="/clients" title="Client List">
                View all your clients and their details.
              </ListItem>
              <ListItem href="/clients/new" title="Add Client">
                Add a new client to your directory.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Projects */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <FolderKanban size={16} />
            Projects
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-2 p-3">
              <ListItem href="/projects" title="Active Projects">
                Manage current projects in progress.
              </ListItem>
              <ListItem href="/projects/archive" title="Archived Projects">
                Browse completed or archived projects.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 text-sm leading-tight no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractKeyFromUrl(url: string): string {
  const u = new URL(url);
  // pathname starts with "/"
  return u.pathname.slice(1);
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours());
  const min = String(now.getMinutes());
  const seconds = String(now.getSeconds());
  return `${year}-${month}-${day} ${hour}:${min}:${seconds}`;
}
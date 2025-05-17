import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getKeyLabel(key: string) {
  // Convert snake_case to spaces
  const withSpaces = key.replace(/_/g, ' ');
  // Convert camelCase to spaces
  const withCamelSpaces = withSpaces.replace(/([A-Z])/g, ' $1');
  // Capitalize first letter and trim any extra spaces
  return withCamelSpaces.charAt(0).toUpperCase() + withCamelSpaces.slice(1).trim();
}


export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
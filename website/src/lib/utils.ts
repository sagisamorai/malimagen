import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0590-\u05FF-]+/g, "")
    .replace(/--+/g, "-");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: "דירה",
    GARDEN_APT: "דירת גן",
    PENTHOUSE: "פנטהאוז",
    COTTAGE: "קוטג׳",
    DUPLEX: "דופלקס",
    STUDIO: "סטודיו",
    LAND: "מגרש",
    COMMERCIAL: "מסחרי",
  };
  return labels[type] || type;
}

export function getPropertyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    FOR_SALE: "למכירה",
    FOR_RENT: "להשכרה",
    SOLD: "נמכר",
    RENTED: "הושכר",
  };
  return labels[status] || status;
}

export function getPropertyStatusColor(status: string): string {
  const colors: Record<string, string> = {
    FOR_SALE: "bg-green-100 text-green-800",
    FOR_RENT: "bg-blue-100 text-blue-800",
    SOLD: "bg-red-100 text-red-800",
    RENTED: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

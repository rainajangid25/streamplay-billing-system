import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent number formatting that works on both server and client
export function formatNumber(num: number): string {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Currency formatting
export function formatCurrency(num: number, currency: string = '$'): string {
  return `${currency}${formatNumber(num)}`
}

// Percentage formatting
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`
}

// Large number formatting (K, M, B)
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return formatNumber(num)
}
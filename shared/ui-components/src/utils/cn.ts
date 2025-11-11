/**
 * Class name utility
 *
 * Merges class names using clsx and tailwind-merge
 * for proper Tailwind CSS class handling.
 *
 * @example
 * cn('bg-primary', 'text-white', someCondition && 'font-bold')
 * cn('glass-card rounded-lg', className)
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

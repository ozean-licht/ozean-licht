/**
 * File Icon Mapper
 *
 * Maps file types and MIME types to Lucide React icons
 */

import {
  FileImage,
  FileVideo,
  FileText,
  FileArchive,
  FileAudio,
  FileCode,
  File,
  Folder,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react'

import type { FileTypeCategory } from '../types'
import { categorizeFileType, getMimeType } from './mime-type-detector'

/**
 * Get icon component for file type category
 *
 * @param category - File type category
 * @param isOpen - Whether folder is open (only for folder category)
 * @returns Lucide icon component
 *
 * @example
 * const Icon = getIconForCategory("image")
 * <Icon className="w-5 h-5 text-primary" />
 */
export function getIconForCategory(
  category: FileTypeCategory,
  isOpen?: boolean
): LucideIcon {
  switch (category) {
    case 'image':
      return FileImage
    case 'video':
      return FileVideo
    case 'document':
      return FileText
    case 'archive':
      return FileArchive
    case 'audio':
      return FileAudio
    case 'code':
      return FileCode
    case 'folder':
      return isOpen ? FolderOpen : Folder
    case 'unknown':
    default:
      return File
  }
}

/**
 * Get icon component for MIME type
 *
 * @param mimeType - MIME type string
 * @returns Lucide icon component
 *
 * @example
 * const Icon = getIconForMimeType("image/jpeg")
 * <Icon className="w-5 h-5 text-primary" />
 */
export function getIconForMimeType(mimeType: string): LucideIcon {
  const category = categorizeFileType(mimeType)
  return getIconForCategory(category)
}

/**
 * Get icon component for filename
 *
 * @param filename - File name or path
 * @param isFolder - Whether the item is a folder
 * @param isOpen - Whether folder is open (only for folders)
 * @returns Lucide icon component
 *
 * @example
 * const Icon = getIconForFile("document.pdf")
 * <Icon className="w-5 h-5 text-primary" />
 */
export function getIconForFile(
  filename: string,
  isFolder?: boolean,
  isOpen?: boolean
): LucideIcon {
  if (isFolder) {
    return getIconForCategory('folder', isOpen)
  }

  const mimeType = getMimeType(filename)
  return getIconForMimeType(mimeType)
}

/**
 * Icon color mapping for file categories (Ozean Licht design system)
 */
export const ICON_COLORS: Record<FileTypeCategory, string> = {
  image: 'text-primary', // Turquoise (#0ec2bc)
  video: 'text-primary',
  document: 'text-[#C4C8D4]', // Paragraph color
  archive: 'text-[#C4C8D4]',
  audio: 'text-primary',
  code: 'text-[#C4C8D4]',
  folder: 'text-primary', // Turquoise for folders
  unknown: 'text-[#C4C8D4]',
}

/**
 * Get icon color class for file type category
 *
 * @param category - File type category
 * @returns Tailwind CSS color class
 *
 * @example
 * getIconColor("image") // "text-primary"
 * getIconColor("document") // "text-[#C4C8D4]"
 */
export function getIconColor(category: FileTypeCategory): string {
  return ICON_COLORS[category]
}

/**
 * Get icon color class for MIME type
 *
 * @param mimeType - MIME type string
 * @returns Tailwind CSS color class
 *
 * @example
 * getIconColorForMimeType("image/jpeg") // "text-primary"
 */
export function getIconColorForMimeType(mimeType: string): string {
  const category = categorizeFileType(mimeType)
  return getIconColor(category)
}

/**
 * Get icon color class for filename
 *
 * @param filename - File name or path
 * @param isFolder - Whether the item is a folder
 * @returns Tailwind CSS color class
 *
 * @example
 * getIconColorForFile("photo.jpg") // "text-primary"
 * getIconColorForFile("document.pdf") // "text-[#C4C8D4]"
 * getIconColorForFile("my-folder", true) // "text-primary"
 */
export function getIconColorForFile(
  filename: string,
  isFolder?: boolean
): string {
  if (isFolder) {
    return getIconColor('folder')
  }

  const mimeType = getMimeType(filename)
  return getIconColorForMimeType(mimeType)
}

/**
 * Icon size mapping
 */
export const ICON_SIZES = {
  sm: 'w-4 h-4', // 16px - For inline text, small buttons
  md: 'w-5 h-5', // 20px - Default size for list items
  lg: 'w-6 h-6', // 24px - For grid view cards
  xl: 'w-8 h-8', // 32px - For large previews
  '2xl': 'w-12 h-12', // 48px - For empty states
} as const

export type IconSize = keyof typeof ICON_SIZES

/**
 * Get icon size class
 *
 * @param size - Icon size preset
 * @returns Tailwind CSS size classes
 *
 * @example
 * getIconSize("md") // "w-5 h-5"
 */
export function getIconSize(size: IconSize = 'md'): string {
  return ICON_SIZES[size]
}

/**
 * Get complete icon classes for a file
 *
 * @param category - File type category
 * @param size - Icon size preset
 * @returns Combined Tailwind CSS classes
 *
 * @example
 * getIconClasses("image", "lg") // "w-6 h-6 text-primary"
 */
export function getIconClasses(
  category: FileTypeCategory,
  size: IconSize = 'md'
): string {
  return `${getIconSize(size)} ${getIconColor(category)}`
}

/**
 * Navigation types for Admin Dashboard
 * Supports entity-aware navigation with Kids Ascension and Ozean Licht sections
 */

import type { LucideIcon } from 'lucide-react';

export type EntityScope = 'kids_ascension' | 'ozean_licht' | 'all';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  entityScope?: EntityScope;
  badge?: string | number;
}

export interface NavigationSection {
  title: string;
  entityScope?: EntityScope;
  items: NavigationItem[];
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

export interface UserEntity {
  entityId: string;
  entityName: string;
  role: string;
  logo?: string;
}

/**
 * Navigation configuration options
 */
export interface NavigationConfig {
  /** Enable/disable breadcrumb navigation */
  breadcrumbEnabled: boolean;
  /** Enable/disable theme toggle */
  themeToggleEnabled: boolean;
  /** Enable/disable search functionality */
  searchEnabled: boolean;
  /** Enable/disable sidebar collapse on desktop */
  sidebarCollapsible: boolean;
  /** Show entity badges in navigation */
  showEntityBadges: boolean;
}

/**
 * Complete navigation state
 */
export interface NavigationState {
  /** Mobile menu open state */
  isMobileMenuOpen: boolean;
  /** Desktop sidebar collapsed state */
  isSidebarCollapsed: boolean;
  /** Current active entity context */
  currentEntity: UserEntity;
  /** All available entities for the user */
  availableEntities: UserEntity[];
}

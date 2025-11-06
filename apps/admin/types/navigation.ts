/**
 * Navigation types for Admin Dashboard
 * Supports entity-aware navigation with Kids Ascension and Ozean Licht sections
 */

export type EntityScope = 'kids_ascension' | 'ozean_licht' | 'all';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
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

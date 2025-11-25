"use client"

import Link from "next/link"
import { Logo } from "../logo"
import { cn } from "../../utils"

export interface FooterProps {
  /** Optional className for custom styling */
  className?: string
  /** Show social media links */
  showSocialLinks?: boolean
  /** Copyright year (defaults to current year) */
  copyrightYear?: number
}

const navigationLinks = [
  {
    title: "Platform",
    links: [
      { label: "Kurse", href: "/kurse" },
      { label: "Videos", href: "/videos" },
      { label: "Events", href: "/events" },
      { label: "Magazin", href: "/magazin" },
    ]
  },
  {
    title: "Über Uns",
    links: [
      { label: "Über Lia", href: "/ueber-lia" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Kooperationen", href: "/kooperationen" },
      { label: "Berufung", href: "/berufung" },
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "Impressum", href: "/impressum" },
      { label: "Teilnahmebedingungen", href: "/teilnahmebedingungen" },
      { label: "Vereinsstatuten", href: "/vereinsstatuten" },
    ]
  }
]

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/ozeanlicht", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com/ozeanlicht", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com/@ozeanlicht", icon: "youtube" },
]

/**
 * Footer component for Ozean Licht platform
 *
 * Features:
 * - Multi-column link organization
 * - Social media links (optional)
 * - Logo and copyright
 * - Glass morphism styling
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <Footer showSocialLinks copyrightYear={2025} />
 * ```
 */
export function Footer({
  className,
  showSocialLinks = true,
  copyrightYear = new Date().getFullYear()
}: FooterProps) {
  return (
    <footer className={cn(
      "w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Logo size={120} variant="horizontal" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Erwecke dein kosmisches Selbst durch Transformation und spirituelles Wissen.
            </p>
          </div>

          {/* Navigation Columns */}
          {navigationLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-decorative text-lg text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        {showSocialLinks && (
          <div className="flex items-center justify-center space-x-6 mb-8 pb-8 border-b border-border/40">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <span className="text-sm">{social.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            © {copyrightYear} Ozean Licht Akademie. Alle Rechte vorbehalten.
          </p>
          <p className="mt-2">
            Made with 💙 and cosmic energy ✨
          </p>
        </div>
      </div>
    </footer>
  )
}

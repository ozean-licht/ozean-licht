/**
 * Mock for next/link in Storybook
 *
 * Next.js Link component is not available in Storybook,
 * so we provide a simple mock that renders an anchor tag.
 */
import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  as?: string;
}

/**
 * Storybook-compatible Link component
 * Renders as a regular anchor tag with href
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, onClick, target, rel, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={className}
        onClick={onClick}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export default Link;

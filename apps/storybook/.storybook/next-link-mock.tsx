import React from 'react';

// Mock Next.js Link component for Storybook
export default function Link({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './alert.stories';

// Compose all stories from alert.stories.tsx
const { Default, Destructive, Warning, Success, Info } = composeStories(stories);

describe('Alert Component - Portable Story Tests', () => {
  describe('Smoke Tests - Rendering', () => {
    it('renders the default alert story', () => {
      render(<Default />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders the destructive variant story', () => {
      render(<Destructive />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/error/i);
    });

    it('renders the warning variant story', () => {
      render(<Warning />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/warning/i);
    });

    it('renders the success variant story', () => {
      render(<Success />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/success/i);
    });

    it('renders the info variant story', () => {
      render(<Info />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Story Args Validation', () => {
    it('destructive story has correct variant', () => {
      expect(Destructive.args?.variant).toBe('destructive');
    });

    it('default story uses default variant', () => {
      expect(Default.args?.variant).toBeUndefined();
    });
  });

  describe('Accessibility', () => {
    it('all alerts have proper role', () => {
      const { container: container1 } = render(<Default />);
      const { container: container2 } = render(<Destructive />);
      const { container: container3 } = render(<Success />);

      expect(container1.querySelector('[role="alert"]')).toBeInTheDocument();
      expect(container2.querySelector('[role="alert"]')).toBeInTheDocument();
      expect(container3.querySelector('[role="alert"]')).toBeInTheDocument();
    });
  });
});

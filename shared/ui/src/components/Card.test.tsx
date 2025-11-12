import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Card.stories';

// Compose all stories from Card.stories.tsx
const { Default, WithHeader, WithFooter, Interactive, Glass } = composeStories(stories);

describe('Card Component - Portable Story Tests', () => {
  describe('Smoke Tests - Rendering', () => {
    it('renders the default card story', () => {
      render(<Default />);
      expect(screen.getByText(/card title/i)).toBeInTheDocument();
      expect(screen.getByText(/card description/i)).toBeInTheDocument();
    });

    it('renders card with header story', () => {
      render(<WithHeader />);
      expect(screen.getByText(/card title/i)).toBeInTheDocument();
    });

    it('renders card with footer story', () => {
      render(<WithFooter />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Variant Tests', () => {
    it('renders interactive card story', () => {
      render(<Interactive />);
      // Interactive card should be in the document
      const card = screen.getByText(/click me/i).closest('[role="button"]');
      expect(card).toBeInTheDocument();
    });

    it('renders glass morphism card story', () => {
      render(<Glass />);
      expect(screen.getByText(/glass card/i)).toBeInTheDocument();
    });
  });

  describe('Story Args Validation', () => {
    it('default story has correct structure', () => {
      expect(Default.args).toBeDefined();
    });

    it('glass story has glass variant', () => {
      expect(Glass.args?.variant).toBe('glass');
    });
  });
});

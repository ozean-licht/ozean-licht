import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Button.stories';

// Compose all stories from Button.stories.tsx
const { Default, Primary, Secondary, Destructive, Loading, Disabled, WithIcon } = composeStories(stories);

describe('Button Component - Portable Story Tests', () => {
  describe('Smoke Tests - Rendering', () => {
    it('renders the default button story', () => {
      render(<Default />);
      expect(screen.getByRole('button', { name: /button/i })).toBeInTheDocument();
    });

    it('renders the primary variant story', () => {
      render(<Primary />);
      expect(screen.getByRole('button', { name: /primary action/i })).toBeInTheDocument();
    });

    it('renders the secondary variant story', () => {
      render(<Secondary />);
      expect(screen.getByRole('button', { name: /secondary action/i })).toBeInTheDocument();
    });

    it('renders the destructive variant story', () => {
      render(<Destructive />);
      expect(screen.getByRole('button', { name: /delete item/i })).toBeInTheDocument();
    });
  });

  describe('State Tests', () => {
    it('renders loading state correctly', () => {
      render(<Loading />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(/processing/i);
    });

    it('renders disabled state correctly', () => {
      render(<Disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Icon Tests', () => {
    it('renders button with icon', () => {
      render(<WithIcon />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Story Args Validation', () => {
    it('primary story has correct variant', () => {
      expect(Primary.args?.variant).toBe('primary');
    });

    it('destructive story has correct variant', () => {
      expect(Destructive.args?.variant).toBe('destructive');
    });

    it('disabled story has disabled prop', () => {
      expect(Disabled.args?.disabled).toBe(true);
    });

    it('loading story has loading prop', () => {
      expect(Loading.args?.loading).toBe(true);
    });
  });
});

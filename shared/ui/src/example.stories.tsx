import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Simple component for testing
const Welcome = ({ title }: { title: string }) => (
  <div style={{
    padding: '2rem',
    background: '#00070F',
    color: '#0EA6C1',
    fontFamily: 'Montserrat, sans-serif',
    borderRadius: '8px',
    border: '1px solid #0EA6C1'
  }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
    <p style={{ color: '#C4C8D4' }}>
      Storybook is now running from packages/shared-ui with Vite!
    </p>
    <p style={{ color: '#C4C8D4', marginTop: '1rem' }}>
      The migration from Next.js to Vite is complete.
    </p>
  </div>
);

const meta: Meta<typeof Welcome> = {
  title: 'Example/Welcome',
  component: Welcome,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Welcome>;

export const Default: Story = {
  args: {
    title: 'Welcome to Ozean Licht Storybook',
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Component Library Documentation',
  },
};
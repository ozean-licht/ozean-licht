import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

const meta = {
  title: 'Tier 1 Primitives/shadcn/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Type of accordion (single item open or multiple)',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[448px]">
      <Accordion {...args} type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Ozean Licht?</AccordionTrigger>
          <AccordionContent>
            Ozean Licht is a content platform offering courses and community features
            with a cosmic oceanic design theme.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What is Kids Ascension?</AccordionTrigger>
          <AccordionContent>
            Kids Ascension is a 100% free educational platform for children ages 6-14,
            providing interactive learning experiences.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How does the admin dashboard work?</AccordionTrigger>
          <AccordionContent>
            The admin dashboard provides multi-tenant management, role-based access
            control, and comprehensive analytics for both platforms.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="w-[448px]">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Design System</AccordionTrigger>
          <AccordionContent>
            Ozean Licht Design System features turquoise (#0ec2bc), deep ocean
            backgrounds, and glass morphism effects.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Technologies</AccordionTrigger>
          <AccordionContent>
            Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and deployed
            via Coolify on Hetzner infrastructure.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Authentication</AccordionTrigger>
          <AccordionContent>
            NextAuth with JWT tokens, role-based permissions, and multi-tenant
            access control via entity scoping.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithGlassEffect: Story = {
  render: () => (
    <div className="w-[448px]">
      <Accordion type="single" collapsible className="glass-card p-4">
        <AccordionItem value="item-1" className="border-primary/25">
          <AccordionTrigger className="hover:text-primary">
            Glass Morphism
          </AccordionTrigger>
          <AccordionContent>
            This accordion demonstrates the glass-card effect with backdrop blur
            and subtle borders.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-primary/25">
          <AccordionTrigger className="hover:text-primary">
            Glow Effects
          </AccordionTrigger>
          <AccordionContent>
            Components can include glow effects on hover for enhanced cosmic aesthetics.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

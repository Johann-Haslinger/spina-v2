import type { Meta, StoryObj } from '@storybook/react';
import '../../index.css';
import Sidebar from './Sidebar';

const meta = {
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

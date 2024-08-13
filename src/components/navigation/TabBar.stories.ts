import type { Meta, StoryObj } from '@storybook/react';
import '../../index.css';
import TabBar from './TabBar';

const meta = {
  title: 'Components/Navigation/TabBar',
  component: TabBar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import '../../index.css';
import NavigationBar from './NavigationBar';

const meta = {
  title: 'Components/Navigation/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

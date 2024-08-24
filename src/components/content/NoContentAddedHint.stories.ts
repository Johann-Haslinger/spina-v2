import type { Meta, StoryObj } from '@storybook/react';
import '../../index.css';
import NoContentAddedHintHint from './NoContentAddedHint';

const meta = {
  title: 'Components/Content/NoContentAddedHint',
  component: NoContentAddedHintHint,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NoContentAddedHintHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { color: '#EE7A2C', backgroundColor: '#F4CF54' },
};

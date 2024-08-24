import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingOverviewStory from './ObservingOverviewStory';

const meta = {
  title: 'Stories/Overview/ObservingOverviewStory',
  component: ObservingOverviewStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingOverviewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

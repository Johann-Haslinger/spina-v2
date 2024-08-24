import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingPodcastCollection from './ObservingPodcastCollection';

const meta = {
  title: 'Stories/Collection/ObservingPodcastCollection',
  component: ObservingPodcastCollection,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingPodcastCollection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

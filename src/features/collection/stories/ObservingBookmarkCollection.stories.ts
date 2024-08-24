import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingBookmarkCollection from './ObservingBookmarkCollection';

const meta = {
  title: 'Stories/Collection/ObservingBookmarkCollection',
  component: ObservingBookmarkCollection,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingBookmarkCollection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

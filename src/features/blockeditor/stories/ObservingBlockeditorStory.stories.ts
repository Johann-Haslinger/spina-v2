import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingBlockeditorStory from './ObservingBlockeditorStory';

const meta = {
  title: 'Stories/Blockeditor/ObservingBlockeditorStory',
  component: ObservingBlockeditorStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingBlockeditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

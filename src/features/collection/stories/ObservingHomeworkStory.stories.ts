import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingHomeworkStory from './ObservingHomeworkStory';

const meta = {
  title: 'Stories/Collection/ObservingHomeworkStory',
  component: ObservingHomeworkStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingHomeworkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

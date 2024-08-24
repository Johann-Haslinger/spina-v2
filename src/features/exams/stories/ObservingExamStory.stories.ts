import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingExamStory from './ObservingExamStory';

const meta = {
  title: 'Stories/Exams/ObservingExamStory',
  component: ObservingExamStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingExamStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import ObservingFlashcardsViewStory from './ObservingFlashcardsViewStory';

const meta = {
  title: 'Stories/Flashcards/ObservingFlashcardsViewStory',
  component: ObservingFlashcardsViewStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ObservingFlashcardsViewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

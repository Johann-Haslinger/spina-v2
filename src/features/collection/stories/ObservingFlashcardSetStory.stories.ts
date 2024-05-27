import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingFlashcardSetStory from "./ObservingFlashcardSetStory";

const meta = {
  title: "Stories/Collection/ObservingFlashcardSetStory",
  component: ObservingFlashcardSetStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingFlashcardSetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

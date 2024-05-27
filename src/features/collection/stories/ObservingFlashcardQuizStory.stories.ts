import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingFlashcardQuizStory from "./ObservingFlashcardQuizStory";

const meta = {
  title: "Stories/Collection/ObservingFlashcardQuizStory",
  component: ObservingFlashcardQuizStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingFlashcardQuizStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

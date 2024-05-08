import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css"
import ObservingExamStory from "./ObservingExamStory";

const meta = {
  title: "Stories/Exams/ObservingExamStory",
  component: ObservingExamStory,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof ObservingExamStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

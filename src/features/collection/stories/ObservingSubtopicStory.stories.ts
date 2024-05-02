import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css"
import ObservingSubtopicStory from "./ObservingSubtopicStory";

const meta = {
  title: "Stories/Collection/ObservingSubtopicStory",
  component: ObservingSubtopicStory,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof ObservingSubtopicStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

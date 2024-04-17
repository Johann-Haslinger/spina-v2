import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css"
import ObservingCollectionStory from "./ObservingCollectionStory";

const meta = {
  title: "Stories/Collection/ObservingCollectionStory",
  component: ObservingCollectionStory,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof ObservingCollectionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

import type { Meta, StoryObj } from "@storybook/react";
import "../index.css"
import ObservingSidebarStory from "./ObservingSidebarStory";

const meta = {
  title: "Stories/ObservingSidebarStory",
  component: ObservingSidebarStory,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof ObservingSidebarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

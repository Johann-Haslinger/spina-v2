import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingTopicStory from "./ObservingTopicStory";

const meta = {
  title: "Stories/Collection/ObservingTopicStory",
  component: ObservingTopicStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingTopicStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

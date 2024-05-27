import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingSubtopicStory from "./ObservingSubtopicStory";

const meta = {
  title: "Stories/Collection/ObservingSubtopicStory",
  component: ObservingSubtopicStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingSubtopicStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

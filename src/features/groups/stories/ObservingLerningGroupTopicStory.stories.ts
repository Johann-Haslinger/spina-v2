import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingLerningGroupTopicStory from "./ObservingLerningGroupTopicStory";

const meta = {
  title: "Stories/LearningGroups/ObservingLerningGroupTopicStory",
  component: ObservingLerningGroupTopicStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingLerningGroupTopicStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

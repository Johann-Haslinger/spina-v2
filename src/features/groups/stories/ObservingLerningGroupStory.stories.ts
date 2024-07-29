import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingLerningGroupStory from "./ObservingLerningGroupStory";

const meta = {
  title: "Stories/LearningGroups/ObservingLerningGroupStory",
  component: ObservingLerningGroupStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingLerningGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css"
import ObservingLerningGroupsStory from "./ObservingLerningGroupsStory";

const meta = {
  title: "Stories/LearningGroups/ObservingLerningGroupsStory",
  component: ObservingLerningGroupsStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingLerningGroupsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};


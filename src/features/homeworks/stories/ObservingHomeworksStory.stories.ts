import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingHomeworksStory from "./ObservingHomeworksStory";

const meta = {
  title: "Stories/Homeworks/ObservingHomeworksStory",
  component: ObservingHomeworksStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingHomeworksStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

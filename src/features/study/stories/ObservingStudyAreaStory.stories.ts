import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingStudyAreaStory from "./ObservingStudyAreaStory";

const meta = {
  title: "Stories/Study/ObservingStudyAreaStory",
  component: ObservingStudyAreaStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingStudyAreaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

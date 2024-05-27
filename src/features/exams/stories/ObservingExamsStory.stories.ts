import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingExamsStory from "./ObservingExamsStory";

const meta = {
  title: "Stories/Exams/ObservingExamsStory",
  component: ObservingExamsStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingExamsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

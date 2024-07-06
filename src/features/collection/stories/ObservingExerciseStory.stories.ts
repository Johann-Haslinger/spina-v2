import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingExerciseStory from "./ObservingExerciseStory";

const meta = {
  title: "Stories/Collection/ObservingExerciseStory",
  component: ObservingExerciseStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingExerciseStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

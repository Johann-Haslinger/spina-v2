import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingNoteStory from "./ObservingNoteStory";

const meta = {
  title: "Stories/Collection/ObservingNoteStory",
  component: ObservingNoteStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingNoteStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

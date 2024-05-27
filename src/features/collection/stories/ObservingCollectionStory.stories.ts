import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingCollectionStory from "./ObservingCollectionStory";

const meta = {
  title: "Stories/Collection/ObservingCollectionStory",
  component: ObservingCollectionStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingCollectionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

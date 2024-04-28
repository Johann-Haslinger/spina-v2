import type { Meta, StoryObj } from "@storybook/react";
import "../../index.css"
import NoContentAddedHintHint from "./NoContentAddedHint";

const meta = {
  title: "Components/Content/NoContentAddedHint",
  component: NoContentAddedHintHint,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    
  },
} satisfies Meta<typeof NoContentAddedHintHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {color: "#EE7A2C", backgroundColor: "#F4CF54"},
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

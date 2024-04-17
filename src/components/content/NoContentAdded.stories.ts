import type { Meta, StoryObj } from "@storybook/react";
import "../../index.css"
import NoContentAdded from "./NoContentAdded";

const meta = {
  title: "Components/Content/NoContentAdded",
  component: NoContentAdded,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    
  },
} satisfies Meta<typeof NoContentAdded>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {color: "#EE7A2C", backgroundColor: "#F4CF54"},
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

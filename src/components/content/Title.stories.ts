import type { Meta, StoryObj } from "@storybook/react";
import "../../index.css"
import NoContentAddedHint from "./NoContentAddedHint";

const meta = {
  title: "Components/Content/Title",
  component: NoContentAddedHint,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    
  },
} satisfies Meta<typeof NoContentAddedHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {color: "black", backgroundColor: "white"}, 
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

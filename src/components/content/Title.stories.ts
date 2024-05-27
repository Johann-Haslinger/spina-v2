import type { Meta, StoryObj } from "@storybook/react";
import "../../index.css";
import NoContentAddedHint from "./NoContentAddedHint";

const meta = {
  title: "Components/Content/Title",
  component: NoContentAddedHint,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NoContentAddedHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { color: "black", backgroundColor: "white" },
};

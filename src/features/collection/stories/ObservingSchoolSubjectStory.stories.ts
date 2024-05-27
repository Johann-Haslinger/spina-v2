import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingSchoolSubjectStory from "./ObservingSchoolSubjectStory";

const meta = {
  title: "Stories/Collection/ObservingSchoolSubjectStory",
  component: ObservingSchoolSubjectStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingSchoolSubjectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

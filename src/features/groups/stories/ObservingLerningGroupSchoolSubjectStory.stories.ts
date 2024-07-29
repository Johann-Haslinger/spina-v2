import type { Meta, StoryObj } from "@storybook/react";
import "../../../index.css";
import ObservingLerningGroupSchoolSubjectStory from "./ObservingLerningGroupSchoolSubjectStory";

const meta = {
  title: "Stories/LearningGroups/ObservingLerningGroupSchoolSubjectStory",
  component: ObservingLerningGroupSchoolSubjectStory,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ObservingLerningGroupSchoolSubjectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

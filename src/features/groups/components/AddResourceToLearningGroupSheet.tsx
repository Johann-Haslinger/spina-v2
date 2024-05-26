import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { Stories } from "../../../base/enums";
import { FlexBox, SecondaryButton, Section, Sheet, Spacer } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../utils/displayText";

const AddResourceToLearningGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => lsc.stories.transitTo(Stories.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        <Spacer />
        <Section></Section>
      </FlexBox>
    </Sheet>
  );
};

export default AddResourceToLearningGroupSheet;

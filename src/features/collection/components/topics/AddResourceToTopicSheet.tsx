import React, { useContext } from "react";
import { CancelButton, FlexBox, Section, SectionRow, Sheet, Spacer } from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";

const AddResourceToTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_RESOURCE_TO_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow role="button">
            Note
        </SectionRow>
        <SectionRow role="button">
          Flashcard Set
        </SectionRow>
        <SectionRow type="last" role="button">
          Homework
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddResourceToTopicSheet;

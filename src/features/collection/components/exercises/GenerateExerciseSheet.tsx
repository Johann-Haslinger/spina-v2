import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { Stories } from "../../../../base/enums";
import {
  FlexBox,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
} from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/displayText";

const GenerateExerciseSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.GENERATING_EXERCISE_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </SecondaryButton>
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow role="button">Frei generieren</SectionRow>
        <SectionRow last role="button">
          Aus Bild generieren
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default GenerateExerciseSheet;

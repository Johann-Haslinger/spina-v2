import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { Story } from '../../../../common/types/enums';
import { displayButtonTexts } from '../../../../common/utilities/displayText';
import { FlexBox, SecondaryButton, Section, SectionRow, Sheet, Spacer } from '../../../../components';

const GenerateExerciseSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.GENERATING_EXERCISE_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
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

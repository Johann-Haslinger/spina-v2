import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { Story } from '../../../../base/enums';
import { FlexBox, SecondaryButton, Section, SectionRow, Sheet, Spacer } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayButtonTexts } from '../../../../utils/displayText';

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

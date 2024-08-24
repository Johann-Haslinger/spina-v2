import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { Story } from '../../../base/enums';
import { FlexBox, SecondaryButton, Section, SectionRow, Sheet, Spacer } from '../../../components';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { displayButtonTexts } from '../../../utils/displayText';

const AddFlashcardGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_FLASHCARD_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_GROUPS_STORY);

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow></SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddFlashcardGroupSheet;

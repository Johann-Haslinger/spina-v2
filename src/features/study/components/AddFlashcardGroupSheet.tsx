import { useContext } from 'react';
import { SecondaryButton, FlexBox, Section, SectionRow, Sheet, Spacer } from '../../../components';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Stories } from '../../../base/enums';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { displayButtonTexts } from '../../../utils/displayText';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';

const AddFlashcardGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_FLASHCARD_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_GROUPS_STORY);

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

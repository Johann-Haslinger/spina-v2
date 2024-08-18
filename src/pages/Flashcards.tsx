import { Fragment } from 'react/jsx-runtime';
import { FlashcardsNavigationStates } from '../base/enums';
import { FlexBox, NavigationBar, Spacer, Title, View } from '../components';
import { FlashcardsBook, FlashcardsOverview, FlashcardsStats, usePageNavigation } from '../features/flashcards';
import LoadCurrentStreakSystem from '../features/flashcards/systems/LoadCurrentStrekSystem';
import LoadFlashcardGroupsSystem from '../features/flashcards/systems/LoadFlashcardGroupsSystem';
import LoadFlashcardSessionsSystem from '../features/flashcards/systems/LoadFlashcardSessionsSystem';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../utils/displayText';

const Flashcards = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { currentNavigationState } = usePageNavigation();

  return (
    <Fragment>
      <LoadFlashcardGroupsSystem />
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar />
        <Spacer size={8} />
        <FlexBox>
          <Title size="large">{displayHeaderTexts(selectedLanguage).flashcards}</Title>
        </FlexBox>
        <Spacer size={6} />
        {currentNavigationState === FlashcardsNavigationStates.OVERVIEW ? (
          <FlashcardsOverview />
        ) : currentNavigationState === FlashcardsNavigationStates.FLASHCARDS ? (
          <FlashcardsBook />
        ) : (
          <FlashcardsStats />
        )}
      </View>
    </Fragment>
  );
};

export default Flashcards;

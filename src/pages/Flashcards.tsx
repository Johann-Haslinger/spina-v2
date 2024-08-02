import { Fragment } from "react/jsx-runtime";
import { FlashcardsNavigationStates } from "../base/enums";
import { FlexBox, NavigationBar, Spacer, Title, View } from "../components";
import {
  FlashcardsBook,
  FlashcardsOverview,
  FlashcardsStats,
  usePageNavigation,
} from "../features/flashcards";
import LoadFlashcardSessionsSystem from "../features/flashcards/systems/LoadFlashcardSessionsSystem";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import LoadCurrentStreakSystem from "../features/flashcards/systems/LoadCurrentStrekSystem";

const Flashcards = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { currentNavigationState } = usePageNavigation();

  return (
    <Fragment>
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar />
        <Spacer size={8} />
        <FlexBox>
          <Title>{displayHeaderTexts(selectedLanguage).flashcards}</Title>
          {/* {segmentedControl} */}
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

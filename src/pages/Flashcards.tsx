import { Fragment } from "react/jsx-runtime";
import { FlashcardsNavigationStates } from "../base/enums";
import { FlexBox, NavigationBar, Spacer, Title, View } from "../components";
import {
  FlashcardsBook,
  FlashcardsOverview,
  FlashcardsStats,
  usePageNavigation,
} from "../features/flashcards";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";

const Flashcards = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { currentNavigationState, segmentedControl } = usePageNavigation();

  return (
    <Fragment>
      <View viewType="baseView">
        <NavigationBar />
        <Spacer size={8} />
        <FlexBox>
          <Title>{displayHeaderTexts(selectedLanguage).flashcards}</Title>
          {segmentedControl}
        </FlexBox>
        <Spacer />
        {currentNavigationState === FlashcardsNavigationStates.OVERVIEW ? (
          <FlashcardsOverview />
        ) : currentNavigationState === FlashcardsNavigationStates.FLASHCARDS ? (
          <FlashcardsBook />
        ) : (
          <FlashcardsStats />
        )}
        ͘͘
      </View>
    </Fragment>
  );
};

export default Flashcards;

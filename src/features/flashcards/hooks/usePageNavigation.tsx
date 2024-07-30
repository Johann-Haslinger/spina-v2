import styled from "@emotion/styled";
import { useState } from "react";
import tw from "twin.macro";
import {
  FlashcardsNavigationStates,
  SupportedLanguages,
} from "../../../base/enums";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../utils/displayText";

const NAVIGATION_STATES_TEXT_DATA = {
  overview: {
    en: "Overview",
    de: "Übersicht",
  },
  flashcards: {
    en: "Flashcards",
    de: "Lernkarten",
  },
  stats: {
    en: "Stats",
    de: "Statistiken",
  },
};

const StyledSegmentedControlWrapper = styled.div`
  ${tw`flex space-x-6 `}
`;

const StyledSegmentedControlButton = styled.button<{ isActive: boolean }>`
  ${tw`transition-all hover:opacity-50 `}
  ${({ isActive }) =>
    isActive ? tw`text-primaryColor underline` : tw`text-[#676767]`}
`;

const usePageNavigation = () => {
  const [currentNavigationState, setCurrentNavigationState] = useState(
    FlashcardsNavigationStates.OVERVIEW,
  );
  const { selectedLanguage } = useSelectedLanguage();

  const changeNavigationState = (
    newNavigationState: FlashcardsNavigationStates,
  ) => setCurrentNavigationState(newNavigationState);

  const formattedNavigationState = (selectedLanguage: SupportedLanguages) => {
    return {
      [FlashcardsNavigationStates.OVERVIEW]:
        NAVIGATION_STATES_TEXT_DATA.overview[selectedLanguage],
      [FlashcardsNavigationStates.FLASHCARDS]:
        displayHeaderTexts(selectedLanguage).flashcards,
      [FlashcardsNavigationStates.STATS]:
        NAVIGATION_STATES_TEXT_DATA.stats[selectedLanguage],
    };
  };

  const segmentedControl = (
    <StyledSegmentedControlWrapper>
      {Object.values(FlashcardsNavigationStates).map((state) => (
        <StyledSegmentedControlButton
          key={state}
          onClick={() => changeNavigationState(state)}
          isActive={currentNavigationState == state}
        >
          {formattedNavigationState(selectedLanguage)[state]}
        </StyledSegmentedControlButton>
      ))}
    </StyledSegmentedControlWrapper>
  );

  return {
    currentNavigationState,
    segmentedControl,
  };
};

export default usePageNavigation;

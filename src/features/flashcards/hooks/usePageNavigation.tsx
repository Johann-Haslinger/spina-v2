import { useState } from 'react';
import { FlashcardsNavigationStates } from '../../../base/enums';

// const StyledSegmentedControlWrapper = styled.div`
//   ${tw`flex space-x-6 mr-2`}
// `;

// const StyledSegmentedControlButton = styled.button<{ isActive: boolean }>`
//   ${tw`transition-all hover:opacity-50 `}
//   ${({ isActive }) => (isActive ? tw`text-[#668FE7] underline` : tw`text-black text-opacity-40`)}
// `;

// const NAVIGATION_STATES_TEXT_DATA = {
//   overview: {
//     en: 'Overview',
//     de: 'Übersicht',
//   },
//   flashcards: {
//     en: 'Flashcards',
//     de: 'Lernkarten',
//   },
//   stats: {
//     en: 'Stats',
//     de: 'Statistiken',
//   },
// };

const usePageNavigation = () => {
  const [currentNavigationState, setCurrentNavigationState] = useState(FlashcardsNavigationStates.OVERVIEW);

  const changeNavigationState = (newNavigationState: FlashcardsNavigationStates) =>
    setCurrentNavigationState(newNavigationState);

  // const formattedNavigationState = (selectedLanguage: SupportedLanguages) => {
  //   return {
  //     [FlashcardsNavigationStates.OVERVIEW]: NAVIGATION_STATES_TEXT_DATA.overview[selectedLanguage],
  //     [FlashcardsNavigationStates.FLASHCARDS]: displayHeaderTexts(selectedLanguage).flashcards,
  //     [FlashcardsNavigationStates.STATS]: NAVIGATION_STATES_TEXT_DATA.stats[selectedLanguage],
  //   };
  // };

  // const segmentedControl = (
  //   <StyledSegmentedControlWrapper>
  //     {Object.values(FlashcardsNavigationStates).map((state) => (
  //       <StyledSegmentedControlButton
  //         key={state}
  //         onClick={() => changeNavigationState(state)}
  //         isActive={currentNavigationState == state}
  //       >
  //         {formattedNavigationState(selectedLanguage)[state]}
  //       </StyledSegmentedControlButton>
  //     ))}
  //   </StyledSegmentedControlWrapper>
  // );

  return {
    currentNavigationState,
    changeNavigationState,
  };
};

export default usePageNavigation;

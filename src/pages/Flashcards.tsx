import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useContext } from 'react';
import { IoPlay } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../base/constants';
import { Story } from '../base/enums';
import FlashcardQuizView from '../common/components/flashcards/FlashcardQuizView';
import { NavigationBar, Spacer, Title, View } from '../components';
import { FlashcardGroupTable, useDueFlashcardsCount } from '../features/flashcards';
import StreakCard from '../features/flashcards/components/StreakCard';
import LoadCurrentStreakSystem from '../features/flashcards/systems/LoadCurrentStrekSystem';
import LoadFlashcardSessionsSystem from '../features/flashcards/systems/LoadFlashcardSessionsSystem';
import { FlashcardChartCard, LastWeekInfoCard } from '../features/overview';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../utils/displayText';

const StyledFlexBox = styled.div`
  ${tw`grid  grid-cols-1 md:grid-cols-2 gap-5 md:gap-3`}
`;

const StyledQuizButton = styled.div`
  ${tw` hidden text-base justify-between rounded-2xl w-full md:w-fit mt-2 md:mt-0 hover:opacity-70 transition-all md:flex space-x-2 pl-4 md:pr-8 h-fit py-2 items-center`}
  color: ${COLOR_ITEMS[6].color};
  background-color: ${COLOR_ITEMS[6].color + 20};
`;

const StyledMobileQuizButton = styled.div`
  ${tw`md:rounded-full justify-between rounded-xl w-full md:w-fit md:mt-0 hover:opacity-70 transition-all md:hidden flex space-x-2 px-4 md:px-5 py-2.5 items-center mr-2`}
  color: ${COLOR_ITEMS[6].color};
  background-color: ${COLOR_ITEMS[6].color + 20};
`;

const StyledQuizButtonContent = styled.div`
  ${tw`flex items-center space-x-4`}
`;

const StyledMobileQuizButtonContent = styled.div`
  ${tw`flex items-center space-x-4`}
`;

const StyledPlayIcon = styled.div`
  ${tw`text-xl`}
`;

const StyledMobilePlayIcon = styled.div`
  ${tw`text-3xl`}
`;

const StyledQuizButtonText = styled.p`
  ${tw`font-semibold`}
`;

const StyledQuizButtonSubText = styled.p`
  ${tw`text-sm opacity-90 relative bottom-0.5`}
`;

const StyledHeaderWrapper = styled.div`
  ${tw`md:flex mb-4 items-end justify-between`}
`;

const StyledCardWrapper = styled.div`
  ${tw`space-y-5 md:space-y-3`}
`;

const Flashcards = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const dueFlashcardsCount = useDueFlashcardsCount();

  const openFlashcardQuiz = () => lsc.stories.transitTo(Story.OBSERVING_SPACED_REPETITION_QUIZ);

  return (
    <Fragment>
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Spacer size={8} />
        <StyledHeaderWrapper>
          <Title>{displayHeaderTexts(selectedLanguage).flashcards}</Title>
          <StyledQuizButton onClick={openFlashcardQuiz}>
            <StyledQuizButtonContent>
              <StyledPlayIcon>
                <IoPlay />
              </StyledPlayIcon>
              <div>
                <p tw="text-sm font-semibold">Abfrage Starten</p>
                <p tw="text-sm">{dueFlashcardsCount} fällige Karten</p>
              </div>
            </StyledQuizButtonContent>
          </StyledQuizButton>
        </StyledHeaderWrapper>

        <StyledFlexBox>
          <FlashcardChartCard />
          <StyledMobileQuizButton>
            <StyledMobileQuizButtonContent onClick={openFlashcardQuiz}>
              <StyledMobilePlayIcon>
                <IoPlay />
              </StyledMobilePlayIcon>
              <div>
                <StyledQuizButtonText>Abfrage Starten</StyledQuizButtonText>
                <StyledQuizButtonSubText>{dueFlashcardsCount} fällige Karten</StyledQuizButtonSubText>
              </div>
            </StyledMobileQuizButtonContent>
          </StyledMobileQuizButton>
          <StyledCardWrapper>
            <StreakCard />
            <LastWeekInfoCard height="17rem" />
          </StyledCardWrapper>
        </StyledFlexBox>

        <FlashcardGroupTable />
      </View>

      <FlashcardQuizView />
    </Fragment>
  );
};

export default Flashcards;

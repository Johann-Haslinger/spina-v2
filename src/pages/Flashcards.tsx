import styled from '@emotion/styled';
import tw from 'twin.macro';
import FlashcardQuizView from '../common/components/flashcards/FlashcardQuizView';
import { useSelectedLanguage } from '../common/hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../common/utilities/displayText';
import { NavigationBar, Spacer, Title, View } from '../components';
import { FlashcardGroupTable } from '../features/flashcards';
import StreakCard from '../features/flashcards/components/StreakCard';
import LoadCurrentStreakSystem from '../features/flashcards/systems/LoadCurrentStrekSystem';
import LoadFlashcardSessionsSystem from '../features/flashcards/systems/LoadFlashcardSessionsSystem';
import { FlashcardChartCard, LastWeekInfoCard, StartFlashcardSessionCard } from '../features/overview';

const StyledColumnsWrapper = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 gap-4`}
`;

const StyledColumn = styled.div`
  ${tw`flex space-y-4 w-full flex-col`}
`;

const Flashcards = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <div>
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).flashcards}</Title>
        <Spacer />
        <StyledColumnsWrapper>
          <StyledColumn>
            <FlashcardChartCard />
            <StreakCard />
          </StyledColumn>

          <StyledColumn>
            <StartFlashcardSessionCard />
            <LastWeekInfoCard />
          </StyledColumn>
        </StyledColumnsWrapper>

        <FlashcardGroupTable />
      </View>

      <FlashcardQuizView />
    </div>
  );
};

export default Flashcards;

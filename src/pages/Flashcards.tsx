import styled from '@emotion/styled';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { NavigationBar, Spacer, Title, View } from '../components';
import { FlashcardGroupTable, WeekInfoCard, WeekStatsCard } from '../features/flashcards';
import StreakCard from '../features/flashcards/components/StreakCard';
import LoadCurrentStreakSystem from '../features/flashcards/systems/LoadCurrentStrekSystem';
import LoadFlashcardGroupsSystem from '../features/flashcards/systems/LoadFlashcardGroupsSystem';
import LoadFlashcardSessionsSystem from '../features/flashcards/systems/LoadFlashcardSessionsSystem';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../utils/displayText';

const StyledFlexBox = styled.div`
  ${tw`grid  grid-cols-1 md:grid-cols-2 gap-3`}
`;

const Flashcards = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <Fragment>
      <LoadFlashcardGroupsSystem />
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar />
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).flashcards}</Title>
        <Spacer />
        <StyledFlexBox>
          <WeekStatsCard />
          <div tw="space-y-3">
            <StreakCard />
            <WeekInfoCard />
          </div>
        </StyledFlexBox>

        <FlashcardGroupTable />
      </View>
    </Fragment>
  );
};

export default Flashcards;

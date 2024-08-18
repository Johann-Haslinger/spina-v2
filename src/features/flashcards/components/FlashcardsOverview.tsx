import styled from '@emotion/styled';
import tw from 'twin.macro';
import FlashcardGroupTable from './overview/FlashcardGroupTable';
import StreakCard from './overview/StreakCard';
import WeekInfoCard from './overview/WeekInfoCard';
import WeekStatsCard from './overview/WeekStatsCard';

const StyledCardsWrapper = styled.div`
  ${tw`md:flex md:space-x-3 space-y-3 md:space-y-0`}
`;

const StyledLeftCardsWrapper = styled.div`
  ${tw`md:w-1/3 h-96 space-y-3`}
`;

const FlashcardsOverview = () => {
  return (
    <div>
      <StyledCardsWrapper>
        <WeekStatsCard />
        <StyledLeftCardsWrapper>
          <StreakCard />
          <WeekInfoCard />
        </StyledLeftCardsWrapper>
      </StyledCardsWrapper>

      <FlashcardGroupTable />
    </div>
  );
};

export default FlashcardsOverview;

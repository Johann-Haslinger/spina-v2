import styled from '@emotion/styled';
import { useState } from 'react';
import { IoStatsChart } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { useLoadingIndicator } from '../../../common/hooks';
import { useWeekInfoData } from '../../flashcards/hooks/useWeekInfoData';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-fit p-4 md:h-[26rem] rounded-2xl bg-[#E76542] bg-opacity-15`}
`;

const StyledBar = styled.div<{ isHovered: boolean }>`
  ${tw` transition-all mr-auto bg-[#E76542]  ml-4 h-4 rounded-r-md opacity-60 `}

  ${({ isHovered }) => isHovered && tw`opacity-100`}
`;

const StyledHeader = styled.div`
  ${tw`flex text-[#E76542] space-x-2  items-center`}
`;

const StyledIconWrapper = styled.div`
  ${tw`rotate-90`}
`;

const StyledTitle = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledSummaryText = styled.div`
  ${tw`mt-2 mb-3 font-medium`}
`;

const StyledPerformanceList = styled.div`
  ${tw`mt-6 space-y-3 text-[#E76542]`}
`;

const StyledFlexItem = styled.div`
  ${tw`items-center flex justify-between`}
`;

const StyledLabel = styled.div`
  ${tw`text-xl`}
`;

const LastWeekInfoCard = () => {
  const { totalCardCount, totalTimeSpent, flashcardPerformance } = useWeekInfoData();
  const [hoveredBar, setHoveredBar] = useState(0);
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  function formatTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} h und ${minutes} min`;
  }

  return (
    <StyledCardWrapper>
      <StyledHeader>
        <StyledIconWrapper>
          <IoStatsChart />
        </StyledIconWrapper>
        <StyledTitle>Letzte 7 Tage</StyledTitle>
      </StyledHeader>

      {!isLoadingIndicatorVisible ? (
        <div>
          <StyledSummaryText>
            Du hast dich in den letzten 7 Tagen{' '}
            <strong>
              {totalCardCount} {totalCardCount == 1 ? 'Karte' : 'Karten'}
            </strong>
            , in <strong>{formatTime(totalTimeSpent)}</strong> abgefragt.
          </StyledSummaryText>

          <StyledPerformanceList>
            {[
              { label: '⏩', value: flashcardPerformance?.skip, id: 1 },
              { label: '❌', value: flashcardPerformance?.forgot, id: 2 },
              { label: '🤔', value: flashcardPerformance?.partiallyRemembered, id: 3 },
              { label: '😀', value: flashcardPerformance?.rememberedWithEffort, id: 4 },
              { label: '👑', value: flashcardPerformance?.easilyRemembered, id: 5 },
            ].map(({ label, value, id }) => (
              <StyledFlexItem key={id} onMouseEnter={() => setHoveredBar(id)} onMouseLeave={() => setHoveredBar(0)}>
                <StyledLabel>{label}</StyledLabel>
                <StyledBar isHovered={hoveredBar === id ? true : false} style={{ width: `${value}%` }} />
                {true && <div tw="ml-4"> {value}%</div>}
              </StyledFlexItem>
            ))}
          </StyledPerformanceList>
        </div>
      ) : (
        <div tw="w-full dark:opacity-10 transition-all mt-3">
          <Skeleton baseColor="#EDB5A9" highlightColor="#EFC9C0" borderRadius={4} tw="w-full h-3" />
          <Skeleton baseColor="#EDB5A9" highlightColor="#EFC9C0" borderRadius={4} tw="w-1/2 h-3" />
        </div>
      )}
    </StyledCardWrapper>
  );
};

export default LastWeekInfoCard;

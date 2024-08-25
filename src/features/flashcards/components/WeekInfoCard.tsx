import styled from '@emotion/styled';
import { useState } from 'react';
import { IoStatsChart } from 'react-icons/io5';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../../../base/constants';
import { useWeekInfoData } from '../hooks/useWeekInfoData';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-fit md:h-[15rem] p-4 pb-6 md:p-5 rounded-2xl   bg-opacity-40`}
  background-color: ${COLOR_ITEMS[0].accentColor + 20};
  color: ${COLOR_ITEMS[0].accentColor};
`;

const StyledFlexBox = styled.div`
  ${tw` mb-4 mt-1  md:flex hidden  justify-between`}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`w-1/2`}
`;

const StyledRightSideWrapper = styled.div`
  ${tw`w-1/2 flex flex-col items-end`}
`;

const StyledBar = styled.div<{ isHoverd: boolean }>`
  ${tw` transition-all mr-auto rounded-r h-3 ml-4  opacity-60 `}
  background-color: ${COLOR_ITEMS[0].accentColor};
  ${({ isHoverd }) => isHoverd && tw`opacity-100`}
`;

const StyledHeader = styled.div`
  ${tw`flex space-x-2 md:opacity-80 items-center`}
`;

const StyledIconWrapper = styled.div`
  ${tw`rotate-90`}
`;

const StyledTitle = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledSummaryText = styled.div`
  ${tw`md:leading-6 mt-1 mb-3 dark:text-white md:hidden text-black font-medium`}
`;

const StyledText = styled.div`
  ${tw`font-medium`}
`;

const StyledPerformanceList = styled.div`
  ${tw`space-y-1 md:space-y-0`}
`;

const StyledFlexItem = styled(StyledFlexBox)`
  ${tw`items-center`}
`;

const WeekInfoCard = () => {
  const { totalCardCount, totalTimeSpent, flashcardPerformance } = useWeekInfoData();
  const [hoveredBar, setHoveredBar] = useState(0);

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  return (
    <StyledCardWrapper>
      <StyledHeader>
        <StyledIconWrapper>
          <IoStatsChart />
        </StyledIconWrapper>
        <StyledTitle>Letzte 7 Tage</StyledTitle>
      </StyledHeader>

      <StyledSummaryText>
        Du hast dich in den letzten 7 Tagen {totalCardCount} Karten, in {formatTime(totalTimeSpent)} abgefragt.
      </StyledSummaryText>

      <StyledFlexBox>
        <StyledLeftSideWrapper>
          <StyledText>{totalCardCount} Karten</StyledText>
        </StyledLeftSideWrapper>
        <StyledRightSideWrapper>
          <StyledText>{formatTime(totalTimeSpent)}</StyledText>
        </StyledRightSideWrapper>
      </StyledFlexBox>

      <StyledPerformanceList>
        {[
          { label: '⏩', value: flashcardPerformance?.skip, id: 1 },
          { label: '❌', value: flashcardPerformance?.forgot, id: 2 },
          { label: '🤔', value: flashcardPerformance?.partiallyRemembered, id: 3 },
          { label: '😀', value: flashcardPerformance?.rememberedWithEffort, id: 4 },
          { label: '👑', value: flashcardPerformance?.easilyRemembered, id: 5 },
        ].map(({ label, value, id }) => (
          <StyledFlexItem key={id} onMouseEnter={() => setHoveredBar(id)} onMouseLeave={() => setHoveredBar(0)}>
            <div>{label}</div>
            <StyledBar isHoverd={hoveredBar === id ? true : false} style={{ width: `${value}%` }} />
            {hoveredBar === id && <div>{value}%</div>}
          </StyledFlexItem>
        ))}
      </StyledPerformanceList>
    </StyledCardWrapper>
  );
};

export default WeekInfoCard;

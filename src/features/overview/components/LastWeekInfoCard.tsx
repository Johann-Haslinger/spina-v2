import styled from '@emotion/styled';
import { useState } from 'react';
import { IoStatsChart } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { useLoadingIndicator } from '../../../common/hooks';
import { useWeekInfoData } from '../../flashcards/hooks/useWeekInfoData';

const StyledCardWrapper = styled.div<{ height: string }>`
  ${tw`w-full h-fit p-4  rounded-2xl bg-[#E76542] bg-opacity-15`}
  ${({ height }) => (height === '24rem' ? tw`md:h-[26rem]` : tw`md:h-[17.25rem]`)}
`;

const StyledBar = styled.div<{ isHovered: boolean; displayLarge: boolean }>`
  ${tw` transition-all mr-auto bg-[#E76542]  h-3 ml-4  opacity-60 `}
  ${({ displayLarge }) => (displayLarge ? tw`h-4 rounded-r-md` : tw`h-3 rounded-r`)}
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

const StyledPerformanceList = styled.div<{ displayLarge: boolean }>`
  ${tw` text-[#E76542]`}
  ${({ displayLarge }) => (displayLarge ? tw`mt-6 space-y-3` : tw` mt-2 space-y-1`)}
`;

const StyledFlexItem = styled.div`
  ${tw`items-center flex justify-between`}
`;

const StyledLabel = styled.div<{ displayLarge: boolean }>`
  ${({ displayLarge }) => (displayLarge ? tw`text-xl` : tw`text-lg`)}
`;

interface CardProps {
  height: '24rem' | '17rem';
}

const LastWeekInfoCard = (props: CardProps) => {
  const { height } = props;
  const { totalCardCount, totalTimeSpent, flashcardPerformance } = useWeekInfoData();
  const [hoveredBar, setHoveredBar] = useState(0);
  const { isLoadingIndicatorVisible } = useLoadingIndicator();
  const displayLarge = height === '24rem';

  function formatTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} h und ${minutes} min`;
  }

  return (
    <StyledCardWrapper height={height}>
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

          <StyledPerformanceList displayLarge={displayLarge}>
            {[
              { label: '⏩', value: flashcardPerformance?.skip, id: 1 },
              { label: '❌', value: flashcardPerformance?.forgot, id: 2 },
              { label: '🤔', value: flashcardPerformance?.partiallyRemembered, id: 3 },
              { label: '😀', value: flashcardPerformance?.rememberedWithEffort, id: 4 },
              { label: '👑', value: flashcardPerformance?.easilyRemembered, id: 5 },
            ].map(({ label, value, id }) => (
              <StyledFlexItem key={id} onMouseEnter={() => setHoveredBar(id)} onMouseLeave={() => setHoveredBar(0)}>
                <StyledLabel displayLarge={displayLarge}>{label}</StyledLabel>
                <StyledBar displayLarge={displayLarge} isHovered={hoveredBar === id ? true : false} style={{ width: `${value}%` }} />
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

import styled from '@emotion/styled';
import { useState } from 'react';
import { IoStatsChart } from 'react-icons/io5';
import tw from 'twin.macro';
import { useIsLoadingIndicatorVisible } from '../../../common/hooks/useIsLoadingIndicatorVisible';
import { useWeekInfoData } from '../../flashcards/hooks/useWeekInfoData';
import Skeleton from 'react-loading-skeleton';

const StyledCardWrapper = styled.div<{ height: string }>`
  ${tw`w-full h-fit p-4  rounded-2xl bg-[#E76542] bg-opacity-15`}
  ${({ height }) => (height === '24rem' ? tw`md:h-[23rem]` : tw`md:h-[17.25rem]`)}
`;

const StyledBar = styled.div<{ isHoverd: boolean }>`
  ${tw` transition-all mr-auto bg-[#E76542] rounded-r h-3 ml-4  opacity-60 `}
  ${({ isHoverd }) => isHoverd && tw`opacity-100`}
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
  ${tw` text-[#E76542] mt-2 space-y-1`}
`;

const StyledFlexItem = styled.div`
  ${tw`items-center  flex justify-between`}
`;

const StyledLabel = styled.div`
  ${tw`text-lg`}
`;

interface CardProps {
  height: '24rem' | '17rem';
}

const LastWeekInfoCard = (props: CardProps) => {
  const { height } = props;
  const { totalCardCount, totalTimeSpent, flashcardPerformance } = useWeekInfoData();
  const [hoveredBar, setHoveredBar] = useState(0);
  const isLoadingIndicatorVisible = useIsLoadingIndicatorVisible();

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} h und ${minutes} min`;
  };

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
                <StyledBar isHoverd={hoveredBar === id ? true : false} style={{ width: `${value}%` }} />
                {true && <div>{value}%</div>}
              </StyledFlexItem>
            ))}
          </StyledPerformanceList>
        </div>
      ) : (
        <div tw="w-full mt-3">
          <Skeleton baseColor="#EDB5A9" highlightColor="#EFC9C0" borderRadius={4} tw="w-full h-3" />
          <Skeleton baseColor="#EDB5A9" highlightColor="#EFC9C0" borderRadius={4} tw="w-1/2 h-3" />
        </div>
      )}
    </StyledCardWrapper>
  );
};

export default LastWeekInfoCard;

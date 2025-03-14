import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoBarChart } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import tw from 'twin.macro';
import { useLoadingIndicator } from '../../../common/hooks';
import { COLOR_ITEMS } from '../../../common/types/constants';
import { useWeekStats } from '../../flashcards/hooks/useWeekStats';

const StyledCardWrapper = styled.div`
  ${tw`w-full scale-100 relative pr-5 h-[28rem] p-4 text-[#6EBED9] rounded-2xl bg-[#6EBED9] bg-opacity-15`}
`;

const StyledColumnContainer = styled.div`
  ${tw`flex items-end h-full flex-col border-white border-opacity-20 `}
`;

const StyledBar = styled.div<{ isHovered?: boolean }>`
  ${tw`bg-[rgb(56,121,246)] opacity-60 backdrop-blur-lg  h-full transition-all w-1/2 mx-auto rounded-t-md `}
  ${({ isHovered }) => isHovered && tw`opacity-100`}
  background-color: ${COLOR_ITEMS[2].color};
`;

const StyledColumnLabel = styled.div`
  ${tw` pt-2 font-semibold text-secondary-text opacity-100 mx-auto flex justify-center w-2 text-center text-xs`}
`;

const StyledAverageMarker = styled(motion.div)`
  ${tw` opacity-100 relative border-t-4 rounded w-full`}
  border-color: ${COLOR_ITEMS[2].color};
`;

const StyledColumnsWrapper = styled.div`
  ${tw`flex w-full h-72 mt-1 `}
`;

const StyledYLabelsWrapper = styled.div`
  ${tw`flex flex-col font-semibold text-secondary-text text-xs pl-1 bottom-2 relative left-1  text-center justify-between`}
`;

const StyledAverageLabelWrapper = styled.div`
  ${tw` w-36 z-0 h-72`}
`;

const StyledAverageLabel = styled.div`
  ${tw`relative bottom-4 h-fit`}
`;

const StyledCardCountText = styled.div`
  ${tw`mt-1 `}
`;

const StyledCardInfo = styled.div`
  ${tw`text-xs text-secondary-text font-semibold text-opacity-100 relative bottom-1.5`}
`;

const StyledAverageMarkerWrapper = styled.div`
  ${tw` h-10 w-full`}
`;

const StyledColumnWrapper = styled.div<{ height: number }>`
  ${tw`mt-auto z-[5] w-full`}
  height: ${({ height }) => (height > 0 ? height + 3 : 0)}%;
`;

const StyledContainer = styled.div`
  ${tw`h-24 mb-3`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 items-center`}
`;

const StyledTitle = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledText = styled.div`
  ${tw`mt-2 text-black dark:text-white font-medium`}
`;

const FlashcardChartCard = () => {
  const { weekDays, maxFlashcards, averageFlashcards, dayLabels } = useWeekStats();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  return (
    <StyledCardWrapper>
      <StyledContainer>
        <StyledFlexContainer>
          <IoBarChart />

          <StyledTitle>Abgefragte Karten</StyledTitle>
        </StyledFlexContainer>
        <StyledText>
          {isLoadingIndicatorVisible ? (
            <div tw="w-full dark:opacity-10 transition-all">
              <Skeleton baseColor="#B8DAE7" highlightColor="#CAE2EB" borderRadius={4} tw="w-full h-3" />
              <Skeleton baseColor="#B8DAE7" highlightColor="#CAE2EB" borderRadius={4} tw="w-1/2 h-3" />
            </div>
          ) : (
            <div>
              {' '}
              Du hast dich in den letzten 7 Tagen im Durchschnitt{' '}
              <strong>
                {averageFlashcards} {averageFlashcards == 1 ? 'Karte' : 'Karten'}
              </strong>{' '}
              pro Tag abgefragt.
            </div>
          )}
        </StyledText>
      </StyledContainer>

      {!isLoadingIndicatorVisible && (
        <StyledColumnsWrapper>
          {averageFlashcards > 0 && (
            <StyledAverageLabelWrapper>
              <motion.div
                initial={{ height: '100%' }}
                transition={{ type: 'tween' }}
                animate={{
                  height: `${100 - ((selectedDay !== null ? weekDays[selectedDay] : averageFlashcards) / maxFlashcards) * 100}%`,
                }}
              />
              <StyledAverageLabel>
                <StyledCardInfo>{selectedDay !== null ? dayLabels[selectedDay] : 'Durchschnitt'}</StyledCardInfo>
                <StyledCardCountText>
                  <span style={{ color: COLOR_ITEMS[2].color }} tw=" font-bold text-lg ">
                    {' '}
                    {selectedDay !== null ? weekDays[selectedDay] : averageFlashcards}{' '}
                  </span>
                  <span tw="text-xs font-semibold  text-secondary-text ">
                    {' '}
                    {averageFlashcards === 1 ? 'Karte' : 'Karten'}
                  </span>
                </StyledCardCountText>
              </StyledAverageLabel>
            </StyledAverageLabelWrapper>
          )}
          {weekDays.map((count = 1, idx) => (
            <div style={{ width: `${100 / weekDays.length}%`, height: '100%' }} key={idx}>
              <StyledColumnContainer>
                <StyledColumnWrapper
                  height={(count / maxFlashcards) * 100 || 0}
                  onMouseEnter={() => setSelectedDay(idx)}
                  onMouseLeave={() => setSelectedDay(null)}
                >
                  <StyledBar isHovered={selectedDay == idx} />
                </StyledColumnWrapper>
              </StyledColumnContainer>
              <StyledColumnLabel>{dayLabels[idx] && dayLabels[idx][0] ? dayLabels[idx][0] : null}</StyledColumnLabel>
            </div>
          ))}
          <StyledYLabelsWrapper>
            <div>{maxFlashcards}</div>
            <div>{maxFlashcards / 2}</div>
            <div tw="relative top-2">0</div>
          </StyledYLabelsWrapper>
        </StyledColumnsWrapper>
      )}

      {averageFlashcards > 0 && !isLoadingIndicatorVisible && (
        <StyledAverageMarkerWrapper>
          <StyledAverageMarker
            transition={{ type: 'tween' }}
            animate={{
              bottom: `${288 / (maxFlashcards / (selectedDay !== null ? weekDays[selectedDay] : averageFlashcards))}px`,
            }}
          />
        </StyledAverageMarkerWrapper>
      )}
    </StyledCardWrapper>
  );
};

export default FlashcardChartCard;

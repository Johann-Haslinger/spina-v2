import styled from '@emotion/styled';
import { useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { IoBarChart } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedFacet, FlashcardCountFacet } from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataTypes } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

const WEEK_DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const StyledCardWrapper = styled.div`
  ${tw`h-[428px] p-6 bg-[rgb(234,242,252)]  rounded-2xl `}
  background-color: ${COLOR_ITEMS[2].accentColor + 30};
  color: ${COLOR_ITEMS[2].accentColor};
`;

const StyledColumnContainer = styled.div`
  ${tw`flex items-end h-full flex-col border-white border-opacity-20 `}
`;

const StyledBar = styled.div<{ isHoverd?: boolean }>`
  ${tw`bg-[rgb(56,121,246)] opacity-60 backdrop-blur-lg  h-full transition-all w-1/2 mx-auto rounded-t-md `}
  ${({ isHoverd }) => isHoverd && tw`opacity-100`}
  background-color: ${COLOR_ITEMS[2].accentColor};
`;

const StyledColumnLabel = styled.div`
  ${tw` pt-2 font-semibold text-seconderyText opacity-100 mx-auto flex justify-center w-2 text-center text-xs`}
`;

const StyledAverageMarker = styled.div`
  ${tw` opacity-100 transition-all  relative border-t-4 rounded w-full`}
  border-color: ${COLOR_ITEMS[2].accentColor};
`;

const StyledColumnsWrapper = styled.div`
  ${tw`flex w-full h-64 mt-1 `}
`;

const StyledYLabelsWrapper = styled.div`
  ${tw`flex flex-col font-semibold text-seconderyText text-xs pl-1 relative left-1 pb-3 bottom-2 text-center justify-between`}
`;

const StyledAverageLabelWrapper = styled.div`
  ${tw` w-36 h-64`}
`;

const StyledAverageLabel = styled.div`
  ${tw`relative bottom-4 h-fit`}
`;

const StyledCardCountText = styled.div`
  ${tw`mt-1 `}
`;

const StyledCardInfo = styled.div`
  ${tw`text-xs text-seconderyText font-semibold text-opacity-100 relative bottom-1`}
`;

const StyledAverageMarkerWrapper = styled.div`
  ${tw` h-10 w-full`}
`;

const StyledColumnWrapper = styled.div<{ height: number }>`
  ${tw`mt-auto w-full`}
  height: ${({ height }) => (height > 0 ? height + 3 : 0)}%;
`;

const WeekStatsCard = () => {
  const { weekDays, maxFlashcards, averageFlashcards, dayLabels } = useWeekStats();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <StyledCardWrapper>
      <div tw="h-24 mb-3">
        <div tw="flex space-x-2 items-center">
          <div tw="">
            <IoBarChart />
          </div>
          <div tw="font-bold text-sm">Abgefragte Karten</div>
        </div>
        <div tw="leading-5  mt-2 text-black font-medium">
          Du hast dich in den letzten 7 Tagen im Durchschnitt {averageFlashcards} Karten pro Tag abgefragt.
        </div>
      </div>

      <StyledColumnsWrapper>
        {averageFlashcards > 0 && (
          <StyledAverageLabelWrapper>
            <div
              tw="transition-all"
              style={{
                height: `${100 - ((selectedDay !== null ? weekDays[selectedDay] : averageFlashcards) / maxFlashcards) * 100}%`,
              }}
            />
            <StyledAverageLabel>
              <StyledCardInfo>{selectedDay !== null ? WEEK_DAYS[selectedDay] : 'Durchschnitt'}</StyledCardInfo>
              <StyledCardCountText>
                <span style={{ color: COLOR_ITEMS[2].accentColor }} tw=" font-bold text-xl ">
                  {' '}
                  {selectedDay !== null ? weekDays[selectedDay] : averageFlashcards}{' '}
                </span>
                <span tw="text-xs font-semibold  text-seconderyText opacity-90">
                  {' '}
                  {averageFlashcards === 1 ? 'Karte' : 'Karten'}
                </span>
              </StyledCardCountText>
            </StyledAverageLabel>
          </StyledAverageLabelWrapper>
        )}
        {weekDays.map((count, idx) => (
          <div style={{ width: `${100 / weekDays.length}%`, height: '100%' }} key={idx}>
            <StyledColumnContainer>
              <StyledColumnWrapper
                height={(count / maxFlashcards) * 100}
                onMouseEnter={() => setSelectedDay(idx)}
                onMouseLeave={() => setSelectedDay(null)}
              >
                <StyledBar isHoverd={selectedDay == idx} />
              </StyledColumnWrapper>
            </StyledColumnContainer>
            <StyledColumnLabel>{dayLabels[idx]}</StyledColumnLabel>
          </div>
        ))}
        <StyledYLabelsWrapper>
          <div>{maxFlashcards}</div>
          <div>{maxFlashcards / 2}</div>
          <div>0</div>
        </StyledYLabelsWrapper>
      </StyledColumnsWrapper>

      {averageFlashcards > 0 && (
        <StyledAverageMarkerWrapper>
          <StyledAverageMarker
            style={{
              bottom: `${256 / (maxFlashcards / (selectedDay !== null ? weekDays[selectedDay] : averageFlashcards))}px`,
            }}
          />
        </StyledAverageMarkerWrapper>
      )}
    </StyledCardWrapper>
  );
};

export default WeekStatsCard;

const useWeekStats = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [flashcardSessionEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataTypes.FLASHCARD_SESSION) &&
      (e.get(DateAddedFacet)?.props.dateAdded || '') > sevenDaysAgo.toISOString(),
  );

  const [weekDays, setWeekDays] = useState<number[]>(new Array(7).fill(0));
  const [maxFlashcards, setMaxFlashcards] = useState(0);
  const [averageFlashcards, setAverageFlashcards] = useState(0);
  const [dayLabels, setDayLabels] = useState<string[]>([]);

  useEffect(() => {
    const newWeekDays = new Array(7).fill(0);
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      days.push(date.toLocaleString('de-DE', { weekday: 'short' })[0]);
    }

    flashcardSessionEntities.forEach((entity) => {
      const date = new Date(entity.get(DateAddedFacet)?.props.dateAdded || '');
      const flashcardCount = entity.get(FlashcardCountFacet)?.props.flashcardCount || 0;

      const dayDifference = Math.floor((today.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
      if (dayDifference <= 6) {
        newWeekDays[6 - dayDifference] += flashcardCount;
      }
    });

    setWeekDays(newWeekDays);

    const maxDay = Math.max(...newWeekDays);
    const evenMaxDay = maxDay % 2 === 0 ? maxDay : maxDay + 1;

    if (evenMaxDay === 0) {
      setMaxFlashcards(8);
    } else {
      setMaxFlashcards(evenMaxDay);
    }

    const average = Math.round(newWeekDays.reduce((acc, curr) => acc + curr, 0) / 7);
    setAverageFlashcards(average);
    setDayLabels(days);
  }, [flashcardSessionEntities.length]);

  return { weekDays, maxFlashcards, averageFlashcards, dayLabels };
};

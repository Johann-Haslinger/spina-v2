import styled from '@emotion/styled';
import { useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { DateAddedFacet, FlashcardCountFacet } from '../../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../../base/constants';
import { DataTypes } from '../../../../base/enums';
import { dataTypeQuery } from '../../../../utils/queries';

const WEEK_DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const StyledCardWrapper = styled.div`
  ${tw`md:w-2/3 text-white bg-fixed pl-6 pr-8 bg-cover pt-14 pb-4 h-[396px] rounded-2xl bg-opacity-40 `}
  background-color: ${COLOR_ITEMS[2].accentColor + 90};
  color: ${COLOR_ITEMS[2].accentColor};
`;

const StyledColumnContainer = styled.div`
  ${tw`flex items-end flex-col border-white border-opacity-20 h-[292px]`}
`;

const StyledBar = styled.div<{ isHoverd?: boolean }>`
  ${tw` bg-opacity-50 backdrop-blur-lg  h-full transition-all w-1/2 mx-auto rounded-t-lg `}
  ${({ isHoverd }) => isHoverd && tw`bg-opacity-100`}
  background-color: ${COLOR_ITEMS[2].accentColor};
`;

const StyledColumnLabel = styled.div`
  ${tw` pt-2.5 text-center text-sm`}
`;

const StyledAverageMarker = styled.div`
  ${tw` transition-all opacity-80 relative border-t w-full`}
  border-color: ${COLOR_ITEMS[2].accentColor};
`;

const StyledColumnsWrapper = styled.div`
  ${tw`flex w-full  `}
`;

const StyledYLabelsWrapper = styled.div`
  ${tw`flex flex-col pl-2 text-sm pb-3 relative bottom-2 text-center justify-between`}
`;

const StyledAverageLabelWrapper = styled.div`
  ${tw`w-28 h-[292px]`}
`;

const StyledAverageLabel = styled.div`
  ${tw`relative bottom-4 h-fit`}
`;

const StyledCardCountText = styled.div`
  ${tw` font-bold text-sm `}
`;

const StyledCardInfo = styled.div`
  ${tw`text-xs relative bottom-0.5`}
`;

const StyledAverageMarkerWrapper = styled.div`
  ${tw` pr-6 pl-20 h-10 w-full`}
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
      <StyledColumnsWrapper>
        <StyledAverageLabelWrapper>
          <div
            tw="transition-all"
            style={{
              height: `${100 - ((selectedDay !== null ? weekDays[selectedDay] : averageFlashcards) / maxFlashcards) * 100}%`,
            }}
          />
          <StyledAverageLabel>
            <StyledCardCountText>
              {selectedDay !== null ? weekDays[selectedDay] : averageFlashcards}{' '}
              <span tw="font-medium"> {averageFlashcards === 1 ? 'Karte' : 'Karten'}</span>
            </StyledCardCountText>
            <StyledCardInfo>{selectedDay !== null ? WEEK_DAYS[selectedDay] : 'Durchschnitt'}</StyledCardInfo>
          </StyledAverageLabel>
        </StyledAverageLabelWrapper>
        {weekDays.map((count, idx) => (
          <div style={{ width: `${100 / weekDays.length}%` }} key={idx}>
            <StyledColumnContainer>
              <StyledColumnWrapper
                height={(count / maxFlashcards) * 100}
                onMouseEnter={() => setSelectedDay(idx)}
                onMouseLeave={() => setSelectedDay(null)}
              >
                <StyledBar isHoverd={selectedDay == idx} />
              </StyledColumnWrapper>
            </StyledColumnContainer>
            <StyledColumnLabel>{idx === 6 ? 'Heute' : dayLabels[idx]}</StyledColumnLabel>
          </div>
        ))}
        <StyledYLabelsWrapper>
          <div>{maxFlashcards}</div>
          <div>{maxFlashcards / 2}</div>
          <div>0</div>
        </StyledYLabelsWrapper>
      </StyledColumnsWrapper>

      <StyledAverageMarkerWrapper>
        <StyledAverageMarker
          style={{
            bottom: `${292 / (maxFlashcards / (selectedDay !== null ? weekDays[selectedDay] : averageFlashcards)) + 30}px`,
          }}
        />
      </StyledAverageMarkerWrapper>
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
      days.push(date.toLocaleString('de-DE', { weekday: 'short' }));
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

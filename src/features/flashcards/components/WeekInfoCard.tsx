import styled from '@emotion/styled';
import { useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import {
  DateAddedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
} from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataTypes } from '../../../base/enums';
import { FlexBox } from '../../../components';
import { dataTypeQuery } from '../../../utils/queries';

type FlashcardPerformance = {
  skip: number;
  forgot: number;
  partiallyRemembered: number;
  rememberedWithEffort: number;
  easilyRemembered: number;
};

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[13rem] py-4 px-5 rounded-2xl   bg-opacity-40`}
  background-color: ${COLOR_ITEMS[0].accentColor + 50};
  color: ${COLOR_ITEMS[0].accentColor};
`;

const StyledFlexBox = styled.div`
  ${tw`flex mb-3  justify-between`}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`w-1/2`}
`;

const StyledRightSideWrapper = styled.div`
  ${tw`w-1/2 flex flex-col items-end`}
`;

const StyledText3 = styled.div`
  ${tw`flex mt-1 w-full justify-end  items-center text-sm`}
`;
const StyledText = styled.div`
  ${tw`relative top-0.5 text-sm`}
`;
const StyledText2 = styled.div`
  ${tw`text-xl font-semibold`}
`;

const StyledBar = styled.div`
  ${tw` hover:opacity-100 transition-all mr-auto rounded-r h-3 ml-4  opacity-90 `}
  background-color: ${COLOR_ITEMS[0].accentColor};
`;

const WeekInfoCard = () => {
  const { totalCardCount, totalTimeSpent, flashcardPerformance } = useWeekInfoData();
  const [hoverdBar, setHoverdBar] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeRange = useFormattedTimeRange();

  return (
    <StyledCardWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <StyledFlexBox>
        <StyledLeftSideWrapper>
          <StyledText>Abfragedauer</StyledText>
          <StyledText2>{totalCardCount} Karten</StyledText2>
        </StyledLeftSideWrapper>
        <StyledRightSideWrapper>
          <StyledText>Abfragedauer</StyledText>
          <StyledText2>
            {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60} min
          </StyledText2>
        </StyledRightSideWrapper>
      </StyledFlexBox>
      <div>
        {' '}
        <FlexBox onMouseEnter={() => setHoverdBar(1)} onMouseLeave={() => setHoverdBar(0)}>
          <div>⏩</div> <StyledBar style={{ width: `${flashcardPerformance?.skip}%` }} />
          {hoverdBar === 1 && <div> {flashcardPerformance?.skip}%</div>}
        </FlexBox>
        <FlexBox onMouseEnter={() => setHoverdBar(2)} onMouseLeave={() => setHoverdBar(0)}>
          <div>❌</div> <StyledBar style={{ width: `${flashcardPerformance?.forgot}%` }} />{' '}
          {hoverdBar === 2 && <div> {flashcardPerformance?.forgot}%</div>}
        </FlexBox>
        <FlexBox onMouseEnter={() => setHoverdBar(3)} onMouseLeave={() => setHoverdBar(0)}>
          <div>🤔</div> <StyledBar style={{ width: `${flashcardPerformance?.partiallyRemembered}%` }} />{' '}
          {hoverdBar === 3 && <div> {flashcardPerformance?.partiallyRemembered}%</div>}
        </FlexBox>
        <FlexBox onMouseEnter={() => setHoverdBar(4)} onMouseLeave={() => setHoverdBar(0)}>
          <div>😀</div> <StyledBar style={{ width: `${flashcardPerformance?.rememberedWithEffort}%` }} />
          {hoverdBar === 4 && <div> {flashcardPerformance?.rememberedWithEffort}%</div>}
        </FlexBox>
        <FlexBox onMouseEnter={() => setHoverdBar(5)} onMouseLeave={() => setHoverdBar(0)}>
          <div>👑</div> <StyledBar style={{ width: `${flashcardPerformance?.easilyRemembered}%` }} />
          {hoverdBar === 5 && <div> {flashcardPerformance?.easilyRemembered}%</div>}
        </FlexBox>
      </div>
      {isHovered && (
        <StyledText3>
          <IoInformationCircleOutline tw="text-lg mr-2" />
          {timeRange}
        </StyledText3>
      )}
    </StyledCardWrapper>
  );
};

export default WeekInfoCard;

const useWeekInfoData = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [flashcardSessionEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataTypes.FLASHCARD_SESSION) &&
      (e.get(DateAddedFacet)?.props.dateAdded || '') > sevenDaysAgo.toISOString(),
  );

  const [totalCardCount, setTotalCardCount] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [flashcardPerformance, setFlashcardPerformance] = useState<FlashcardPerformance>();

  useEffect(() => {
    const cardCount = flashcardSessionEntities.reduce((acc, entity) => {
      return acc + (entity.get(FlashcardCountFacet)?.props.flashcardCount || 0);
    }, 0);
    setTotalCardCount(cardCount);

    const timeSpent = flashcardSessionEntities.reduce((acc, entity) => {
      return acc + (entity.get(DurationFacet)?.props.duration || 0);
    }, 0);

    setTotalTimeSpent(timeSpent);

    let performance = {
      skip: 0,
      forgot: 0,
      partiallyRemembered: 0,
      rememberedWithEffort: 0,
      easilyRemembered: 0,
    };

    flashcardSessionEntities.forEach((entity) => {
      const entityPerformance = entity.get(FlashcardPerformanceFacet)?.props.flashcardPerformance;
      if (entityPerformance) {
        performance = {
          skip: performance.skip + entityPerformance.skip,
          forgot: performance.forgot + entityPerformance.forgot,
          partiallyRemembered: performance.partiallyRemembered + entityPerformance.partiallyRemembered,
          rememberedWithEffort: performance.rememberedWithEffort + entityPerformance.rememberedWithEffort,
          easilyRemembered: performance.easilyRemembered + entityPerformance.easilyRemembered,
        };
      }
    });

    const skipPercentage = Math.round((performance.skip / cardCount) * 100);
    const forgotPercentage = Math.round((performance.forgot / cardCount) * 100);
    const partiallyRememberedPercentage = Math.round((performance.partiallyRemembered / cardCount) * 100);
    const rememberedWithEffortPercentage = Math.round((performance.rememberedWithEffort / cardCount) * 100);
    const easilyRememberedPercentage = Math.round((performance.easilyRemembered / cardCount) * 100);

    setFlashcardPerformance({
      skip: skipPercentage,
      forgot: forgotPercentage,
      partiallyRemembered: partiallyRememberedPercentage,
      rememberedWithEffort: rememberedWithEffortPercentage,
      easilyRemembered: easilyRememberedPercentage,
    });
  }, [flashcardSessionEntities.length]);

  return { totalCardCount, totalTimeSpent, flashcardPerformance };
};

const useFormattedTimeRange = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  };

  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - 7);
  const formattedPastDate = formatDate(pastDate);

  return <div tw="text-sm mt-1.5">{formattedPastDate} - Heute</div>;
};

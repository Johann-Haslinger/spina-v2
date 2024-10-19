import { useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import {
  DateAddedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
} from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export type FlashcardPerformance = {
  skip: number;
  forgot: number;
  partiallyRemembered: number;
  rememberedWithEffort: number;
  easilyRemembered: number;
};

export const useWeekInfoData = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [flashcardSessionEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataType.FLASHCARD_SESSION) &&
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
      skip: skipPercentage || 0,
      forgot: forgotPercentage || 0,
      partiallyRemembered: partiallyRememberedPercentage || 0,
      rememberedWithEffort: rememberedWithEffortPercentage || 0,
      easilyRemembered: easilyRememberedPercentage || 0,
    });
  }, [flashcardSessionEntities.length]);

  return { totalCardCount, totalTimeSpent, flashcardPerformance };
};

import { useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { DateAddedFacet, FlashcardCountFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useWeekStats = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [flashcardSessionEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataType.FLASHCARD_SESSION) &&
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
      days.push(date.toLocaleString('de-DE', { weekday: 'long' }));
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

    const average = Math.ceil(newWeekDays.reduce((acc, curr) => acc + curr, 0) / 7);
    setAverageFlashcards(average);
    setDayLabels(days);
  }, [flashcardSessionEntities.length]);

  return { weekDays, maxFlashcards, averageFlashcards, dayLabels };
};

import { Entity, useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { DateAddedFacet, FlashcardCountFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

const getMaxFlashcardsPerDay = (flashcardSessionEntities: readonly Entity[]): number => {
  const flashcardsPerDay: { [date: string]: number } = {};

  flashcardSessionEntities.forEach((sessionEntity) => {
    const session_date = sessionEntity.get(DateAddedFacet)?.props.dateAdded || '';
    const flashcard_count = sessionEntity.get(FlashcardCountFacet)?.props.flashcardCount || 0;
    if (flashcardsPerDay[session_date]) {
      flashcardsPerDay[session_date] += flashcard_count;
    } else {
      flashcardsPerDay[session_date] = flashcard_count;
    }
  });

  return Math.max(...Object.values(flashcardsPerDay));
};

const getLastSevenWeeksDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  const currentWeekDay = today.getDay() || 7;
  today.setDate(today.getDate() - currentWeekDay + 7);

  for (let i = 0; i < 7 * 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates.reverse();
};
export const useLastSevenWeeksStats = () => {
  const currentDate = new Date();
  const sevenWeeksAgo = new Date(currentDate.setDate(currentDate.getDate() - 49)).toISOString();

  const [flashcardSessionEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataType.FLASHCARD_SESSION) && (e.get(DateAddedFacet)?.props.dateAdded || '') > sevenWeeksAgo,
  );

  const lastSevenWeeksDates = getLastSevenWeeksDates();

  const [lastSevenWeeks, setLastSevenWeeks] = useState<{ percent: number; total: number }[][]>(
    Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => ({ percent: 0, total: 0 }))),
  );

  const totalFlashcardCount = lastSevenWeeks.reduce(
    (acc, week) => acc + week.reduce((acc, day) => acc + day.total, 0),
    0,
  );

  useEffect(() => {
    if (flashcardSessionEntities.length === 0) return;

    const maxFlashcardsPerDay = getMaxFlashcardsPerDay(flashcardSessionEntities);

    const flashcardsPerDay: { [date: string]: number } = {};

    flashcardSessionEntities.forEach((sessionEntity) => {
      const session_date = new Date(sessionEntity.get(DateAddedFacet)?.props.dateAdded || '')
        .toISOString()
        .split('T')[0];
      const flashcard_count = sessionEntity.get(FlashcardCountFacet)?.props.flashcardCount || 0;

      if (flashcardsPerDay[session_date]) {
        flashcardsPerDay[session_date] += flashcard_count;
      } else {
        flashcardsPerDay[session_date] = flashcard_count;
      }
    });

    const newLastSevenWeeks = Array.from({ length: 7 }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = lastSevenWeeksDates[weekIndex * 7 + dayIndex];
        const cardsLearned = flashcardsPerDay[date] || 0;
        return {
          percent: maxFlashcardsPerDay ? cardsLearned / maxFlashcardsPerDay : 0,
          total: cardsLearned,
        };
      }),
    );

    setLastSevenWeeks(newLastSevenWeeks);
  }, [flashcardSessionEntities.length]);

  return { lastSevenWeeks, lastSevenWeeksDates, totalFlashcardCount };
};

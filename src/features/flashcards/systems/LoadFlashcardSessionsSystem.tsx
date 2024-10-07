import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import {
  DateAddedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
} from '../../../base/additionalFacets';
import { dummyFlashcardSessions } from '../../../base/dummy';
import { DataType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchFlashcardSessions = async () => {
  const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: flashcardSessions, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SESSIONS)
    .select(
      'id, flashcard_count, session_date, duration, skip, forgot, partially_remembered, remembered_with_effort, easily_remembered',
    )
    .gte('session_date', sevenDaysAgo);

  if (error) {
    console.error('Error fetching flashcard sessions:', error);
  }

  return flashcardSessions || [];
};

const fetchLastSevenWeeksFlashcardSessions = async () => {
  const currentDate = new Date();
  const sevenWeeksAgo = new Date(currentDate.setDate(currentDate.getDate() - 49)).toISOString();
  const { data, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SESSIONS)
    .select('session_date, flashcard_count, id')
    .gte('session_date', sevenWeeksAgo)
    .neq('flashcard_count', 0);

  if (error) {
    console.error('Error fetching last seven weeks flashcard sessions:', error);
    return [];
  }

  return data;
};

const LoadFlashcardSessionsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeLastWeekFlashcardSessionEntities = async () => {
      if (!isUsingMockupData && !isUsingSupabaseData) return;

      const flashcardSessions = isUsingMockupData
        ? dummyFlashcardSessions
        : isUsingSupabaseData
          ? await fetchFlashcardSessions()
          : [];

      flashcardSessions.forEach((flashcardSession) => {
        const isAlreadyExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcardSession.id && e.hasTag(DataType.FLASHCARD_SESSION),
        );

        if (isAlreadyExisting) {
          const flashcardSessionEntity = lsc.engine.entities.find(
            (e) => e.get(IdentifierFacet)?.props.guid === flashcardSession.id,
          );
          if (!flashcardSessionEntity) return;
          lsc.engine.removeEntity(flashcardSessionEntity);
        }
        const flashcardSessionEntity = new Entity();
        lsc.engine.addEntity(flashcardSessionEntity);
        flashcardSessionEntity.add(new IdentifierFacet({ guid: flashcardSession.id }));
        flashcardSessionEntity.add(new DateAddedFacet({ dateAdded: flashcardSession.session_date }));
        flashcardSessionEntity.add(
          new FlashcardCountFacet({
            flashcardCount: flashcardSession.flashcard_count,
          }),
        );
        flashcardSessionEntity.add(new DurationFacet({ duration: flashcardSession.duration }));
        flashcardSessionEntity.add(
          new FlashcardPerformanceFacet({
            flashcardPerformance: {
              skip: flashcardSession.skip,
              forgot: flashcardSession.forgot,
              partiallyRemembered: flashcardSession.partially_remembered,
              rememberedWithEffort: flashcardSession.remembered_with_effort,
              easilyRemembered: flashcardSession.easily_remembered,
            },
          }),
        );
        flashcardSessionEntity.addTag(DataType.FLASHCARD_SESSION);
      });
    };

    const initializeLastSevenWeeksFlashcardSessionEntities = async () => {
      if (!isUsingMockupData && !isUsingSupabaseData) return;

      const flashcardSessions = isUsingMockupData
        ? dummyFlashcardSessions
        : isUsingSupabaseData
          ? await fetchLastSevenWeeksFlashcardSessions()
          : [];

      flashcardSessions.forEach((flashcardSession) => {
        const isAlreadyExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcardSession.id && e.hasTag(DataType.FLASHCARD_SESSION),
        );

        if (!isAlreadyExisting) {
          const flashcardSessionEntity = new Entity();
          lsc.engine.addEntity(flashcardSessionEntity);
          flashcardSessionEntity.add(new IdentifierFacet({ guid: flashcardSession.id }));
          flashcardSessionEntity.add(new DateAddedFacet({ dateAdded: flashcardSession.session_date }));
          flashcardSessionEntity.add(
            new FlashcardCountFacet({
              flashcardCount: flashcardSession.flashcard_count,
            }),
          );
          flashcardSessionEntity.addTag(DataType.FLASHCARD_SESSION);
        }
      });
    };
    initializeLastWeekFlashcardSessionEntities();
    setTimeout(() => initializeLastSevenWeeksFlashcardSessionEntities(), 300);
  }, [lsc, isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadFlashcardSessionsSystem;

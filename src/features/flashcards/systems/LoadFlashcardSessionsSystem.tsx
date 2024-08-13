import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import {
  DateAddedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
} from '../../../app/additionalFacets';
import { dummyFlashcardSessions } from '../../../base/dummy';
import { DataTypes, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchFlashcardSessions = async () => {
  const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: flashcardSessions, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARD_SESSIONS)
    .select(
      'id, flashcard_count, date_added, duration, skip, forgot, partially_remembered, rememberd_with_effort, easily_remembered',
    )
    .gte('date_added', sevenDaysAgo);

  if (error) {
    console.error('Error fetching flashcard sessions:', error);
  }

  return flashcardSessions || [];
};

const LoadFlashcardSessionsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeFlashcardSessionEntities = async () => {
      const flashcardSessions = isUsingMockupData
        ? dummyFlashcardSessions
        : isUsingSupabaseData
          ? await fetchFlashcardSessions()
          : [];

      flashcardSessions.forEach((flashcardSession) => {
        const isAlreadyExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcardSession.id && e.hasTag(DataTypes.FLASHCARD_SESSION),
        );

        if (!isAlreadyExisting) {
          const flashcardSessionEntity = new Entity();
          lsc.engine.addEntity(flashcardSessionEntity);
          flashcardSessionEntity.add(new IdentifierFacet({ guid: flashcardSession.id }));
          flashcardSessionEntity.add(new DateAddedFacet({ dateAdded: flashcardSession.date_added }));
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
                rememberedWithEffort: flashcardSession.rememberd_with_effort,
                easilyRemembered: flashcardSession.easily_remembered,
              },
            }),
          );
          flashcardSessionEntity.addTag(DataTypes.FLASHCARD_SESSION);
        }
      });
    };

    initializeFlashcardSessionEntities();
  }, [lsc, isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadFlashcardSessionsSystem;

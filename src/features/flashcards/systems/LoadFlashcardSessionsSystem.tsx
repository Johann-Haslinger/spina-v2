import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import {
  DateAddedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
} from '../../../app/additionalFacets';
import { dummyFlashcardSessions } from '../../../base/dummy';
import { DataType, SupabaseTable } from '../../../base/enums';
import { useLoadingIndicator } from '../../../common/hooks';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchFlashcardSessions = async () => {
  const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: flashcardSessions, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SESSIONS)
    .select(
      'id, flashcard_count, session_date, duration, skip, forgot, partially_remembered, remembered_with_effort, easily_remembered',
    )
    .gte('session_date^', sevenDaysAgo);

  if (error) {
    console.error('Error fetching flashcard sessions:', error);
  }

  return flashcardSessions || [];
};

const LoadFlashcardSessionsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const { loadingIndicatorEntity } = useLoadingIndicator();

  useEffect(() => {
    const initializeFlashcardSessionEntities = async () => {
      loadingIndicatorEntity?.add(Tags.CURRENT);

      const flashcardSessions = isUsingMockupData
        ? dummyFlashcardSessions
        : isUsingSupabaseData
          ? await fetchFlashcardSessions()
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
        }
      });
      loadingIndicatorEntity?.remove(Tags.CURRENT);
    };

    initializeFlashcardSessionEntities();
  }, [lsc, isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadFlashcardSessionsSystem;

import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { dummyFlashcards } from '../../../common/types/dummy';
import { SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';
import { useDueFlashcards } from './useDueFlashcards';

const fetchDueFlashcards = async () => {
  const currentDateTime = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('is_bookmarked')
    .lte('due_date', currentDateTime);

  if (error) {
    console.error('Error fetching due flashcards:', error);
  }
  return data || [];
};

export const useDueFlashcardsCount = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const { dueFlashcardEntity, dueFlashcardsCount } = useDueFlashcards();

  useEffect(() => {
    const isEntityAlreadyAdded = lsc.engine.entities.some(
      (e) => e.get(IdentifierFacet)?.props.guid === 'dueFlashcards',
    );
    if (isEntityAlreadyAdded) return;
    const newDueFlashcardsEntity = new Entity();
    lsc.engine.addEntity(newDueFlashcardsEntity);
    newDueFlashcardsEntity.add(new IdentifierFacet({ guid: 'dueFlashcards' }));
    newDueFlashcardsEntity.add(new CountFacet({ count: 0 }));
  }, []);

  useEffect(() => {
    const countDueFlashcards = async () => {
      const dueFlashcards = isUsingMockupData ? dummyFlashcards : isUsingSupabaseData ? await fetchDueFlashcards() : [];

      if (dueFlashcards) {
        dueFlashcardEntity?.add(new CountFacet({ count: dueFlashcards.length }));
      }
    };

    countDueFlashcards();
  }, [isUsingMockupData, isUsingSupabaseData, dueFlashcardEntity]);

  return dueFlashcardsCount;
};

import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { AnswerFacet, QuestionFacet } from '../../../common/types/additionalFacets';
import { dummyFlashcards } from '../../../common/types/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';
import { useSelectedGroupSubtopic } from '../hooks/useSelectedGroupSubtopic';

const fetchFlashcardsForGroupSubtopic = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTable.GROUP_FLASHCARDS)
    .select('question, id, answer')
    .eq(SupabaseColumn.PARENT_ID, parentId);

  if (error) {
    console.error('Error fetching subtopic flashcards:', error);
    return [];
  }

  return flashcards || [];
};

const LoadGroupSubtopicResourcesSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupSubtopicId } = useSelectedGroupSubtopic();

  useEffect(() => {
    const initializeSubtopicFlashcardEntities = async () => {
      if (selectedGroupSubtopicId) {
        const flashcards = mockupData
          ? dummyFlashcards
          : shouldFetchFromSupabase
            ? await fetchFlashcardsForGroupSubtopic(selectedGroupSubtopicId)
            : [];

        flashcards.forEach((flashcard) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === flashcard.id && e.hasTag(DataType.GROUP_FLASHCARD),
          );

          if (!isExisting) {
            const flashcardEntity = new Entity();
            lsc.engine.addEntity(flashcardEntity);
            flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
            flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
            flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
            flashcardEntity.add(new ParentFacet({ parentId: selectedGroupSubtopicId }));

            flashcardEntity.addTag(DataType.GROUP_FLASHCARD);
          }
        });
      }
    };

    initializeSubtopicFlashcardEntities();
  }, [selectedGroupSubtopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupSubtopicResourcesSystem;

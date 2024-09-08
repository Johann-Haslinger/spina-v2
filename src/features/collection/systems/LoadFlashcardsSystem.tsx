import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from '../../../app/additionalFacets';
import { dummyFlashcards } from '../../../base/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { dataTypeQuery } from '../../../utils/queries';

const fetchFlashcardsForFlashcardGroup = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('question, id, answer, mastery_level')
    .eq(SupabaseColumn.PARENT_ID, parentId);

  if (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }

  return flashcards || [];
};

const LoadFlashcardsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const [selectedFlashcardGroupEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.hasTag(Tags.SELECTED),
  );
  const selectedFlashcardGroupId = selectedFlashcardGroupEntity?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const initializeFlashcardEntities = async () => {
      if (selectedFlashcardGroupId) {
        const flashcards = mockupData
          ? dummyFlashcards
          : shouldFetchFromSupabase
            ? await fetchFlashcardsForFlashcardGroup(selectedFlashcardGroupId)
            : [];

        flashcards.forEach((flashcard) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === flashcard.id && e.hasTag(DataType.FLASHCARD),
          );

          if (!isExisting) {
            const flashcardEntity = new Entity();
            lsc.engine.addEntity(flashcardEntity);
            flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
            flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: flashcard.mastery_level }));
            flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
            flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
            flashcardEntity.add(new ParentFacet({ parentId: selectedFlashcardGroupId }));
            flashcardEntity.addTag(DataType.FLASHCARD);
          }
        });
      }
    };

    initializeFlashcardEntities();
  }, [selectedFlashcardGroupId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadFlashcardsSystem;

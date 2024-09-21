import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from '../../../app/additionalFacets';
import { dummyFlashcards } from '../../../base/dummy';
import { AdditionalTag, DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useSelectedLearningUnit } from '../../../common/hooks/useSelectedLearningUnit';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchFlashcardsForFlashcardGroup = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('question, id, answer, mastery_level, is_bookmarked')
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
  const { selectedLearningUnitId } = useSelectedLearningUnit();

  useEffect(() => {
    const initializeFlashcardEntities = async () => {
      if (selectedLearningUnitId) {
        const flashcards = mockupData
          ? dummyFlashcards
          : shouldFetchFromSupabase
            ? await fetchFlashcardsForFlashcardGroup(selectedLearningUnitId)
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
            flashcardEntity.add(new ParentFacet({ parentId: selectedLearningUnitId }));
            flashcardEntity.addTag(DataType.FLASHCARD);

            if (flashcard.is_bookmarked) {
              flashcardEntity.addTag(AdditionalTag.BOOKMARKED);
            }
          }
        });
      }
    };

    initializeFlashcardEntities();
  }, [selectedLearningUnitId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadFlashcardsSystem;

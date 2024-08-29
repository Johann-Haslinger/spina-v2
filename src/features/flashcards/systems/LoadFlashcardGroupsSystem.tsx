import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { PriorityFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyFlashcardSets, dummySubtopics } from '../../../base/dummy';
import { DataType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchFlashcardSets = async () => {
  const { data: flashcardSets, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SETS)
    .select('id, title, priority, parent_id');

  if (error) {
    console.error('Error fetching flashcard sets', error);
  }

  return flashcardSets || [];
};

const fetchSubtopics = async () => {
  const { data: subtopics, error } = await supabaseClient
    .from(SupabaseTable.SUBTOPICS)
    .select('id, title, priority, parent_id');

  if (error) {
    console.error('Error fetching subtopics', error);
  }

  return subtopics || [];
};

const LoadFlashcardGroupsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingSupabaseData, isUsingMockupData } = useCurrentDataSource();

  useEffect(() => {
    const initializeSubtopicEntities = async () => {
      const subtopic = isUsingMockupData ? dummySubtopics : isUsingSupabaseData ? await fetchSubtopics() : [];

      subtopic.forEach((subtopic) => {
        const isExisting = lsc.engine.entities.some((e) => e.get(IdentifierFacet)?.props.guid === subtopic.id);

        if (!isExisting) {
          const subtopicEntity = new Entity();
          lsc.engine.addEntity(subtopicEntity);
          subtopicEntity.add(new IdentifierFacet({ guid: subtopic.id }));
          subtopicEntity.add(new TitleFacet({ title: subtopic.title }));
          subtopicEntity.add(new PriorityFacet({ priority: subtopic.priority }));
          subtopicEntity.add(new ParentFacet({ parentId: subtopic.parent_id }));
          subtopicEntity.add(DataType.SUBTOPIC);
        }
      });
    };
    const initializeFlashcardSetEntities = async () => {
      const flashcardSets = isUsingMockupData
        ? dummyFlashcardSets
        : isUsingSupabaseData
          ? await fetchFlashcardSets()
          : [];

      flashcardSets.forEach((flashcardSet) => {
        const isExisting = lsc.engine.entities.some((e) => e.get(IdentifierFacet)?.props.guid === flashcardSet.id);

        if (!isExisting) {
          const flashcardSetEntity = new Entity();
          lsc.engine.addEntity(flashcardSetEntity);
          flashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
          flashcardSetEntity.add(new TitleFacet({ title: flashcardSet.title }));
          flashcardSetEntity.add(new PriorityFacet({ priority: flashcardSet.priority }));
          flashcardSetEntity.add(new ParentFacet({ parentId: flashcardSet.parent_id }));
          flashcardSetEntity.add(DataType.FLASHCARD_SET);
        }
      });
    };

    initializeSubtopicEntities();
    initializeFlashcardSetEntities();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadFlashcardGroupsSystem;

import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyFlashcardSets, dummySubtopics } from '../../../base/dummy';
import { AdditionalTag, DataType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { dataTypeQuery } from '../../../utils/queries';

const fetchFlashcardSets = async () => {
  const { data: flashcardSets, error } = await supabaseClient
    .from('flashcardSets')
    .select('title, id, date_added, bookmarked')
    .order('date_added', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching flashcardSets:', error);
    return [];
  }

  return flashcardSets || [];
};

const fetchSubtopics = async () => {
  const { data: subtopics, error } = await supabaseClient
    .from(SupabaseTable.SUBTOPICS)
    .select('title, id, date_added, bookmarked')
    .order('date_added', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching subtopics:', error);
    return [];
  }

  return subtopics || [];
};

const InitializeFlashcardGroupsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeFlashcardSetEntities = async () => {
      const flashcardSets = mockupData ? dummyFlashcardSets : shouldFetchFromSupabase ? await fetchFlashcardSets() : [];

      flashcardSets.forEach((flashcardSet) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcardSet.id && dataTypeQuery(e, DataType.FLASHCARD_SET),
        );

        if (!isExisting) {
          const flashcardGroupEntity = new Entity();
          lsc.engine.addEntity(flashcardGroupEntity);
          flashcardGroupEntity.add(
            new DateAddedFacet({
              dateAdded: flashcardSet.date_added || new Date().toISOString(),
            }),
          );
          flashcardGroupEntity.add(new TitleFacet({ title: flashcardSet.title }));
          flashcardGroupEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
          flashcardGroupEntity.addTag(DataType.FLASHCARD_SET);
          flashcardGroupEntity.addTag(DataType.FLASHCARD_GROUP);

          if (flashcardSet.bookmarked) {
            flashcardGroupEntity.addTag(AdditionalTag.BOOKMARKED);
          }
        }
      });
    };

    const initializeSubtopicEntities = async () => {
      const subtopics = mockupData ? dummySubtopics : await fetchSubtopics();

      subtopics.forEach((subtopic) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === subtopic.id && dataTypeQuery(e, DataType.SUBTOPIC),
        );

        if (!isExisting) {
          const subtopicEntity = new Entity();
          lsc.engine.addEntity(subtopicEntity);
          subtopicEntity.add(
            new DateAddedFacet({
              dateAdded: subtopic.date_added || new Date().toISOString(),
            }),
          );
          subtopicEntity.add(new TitleFacet({ title: subtopic.title }));
          subtopicEntity.add(new IdentifierFacet({ guid: subtopic.id }));
          subtopicEntity.addTag(DataType.SUBTOPIC);
          subtopicEntity.addTag(DataType.FLASHCARD_GROUP);

          if (subtopic.bookmarked) {
            subtopicEntity.addTag(AdditionalTag.BOOKMARKED);
          }
        }
      });
    };

    initializeSubtopicEntities();
    initializeFlashcardSetEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeFlashcardGroupsSystem;

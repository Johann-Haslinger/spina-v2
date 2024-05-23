import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyFlashcardSets } from '../../../base/dummy';
import { DataTypes } from '../../../base/enums';
import { useMockupData } from '../../../hooks/useMockupData';
import supabaseClient from '../../../lib/supabase';
import { useSelectedGroupTopic } from '../hooks/useSelectedGroupTopic';


const fetchGroupFlashcardSetsForTopic = async (topicId: string) => {
  const { data: groupFlashcardSets, error } = await supabaseClient
    .from("group_flashcard_sets")
    .select("flashcardSetName, id, date_added")
    .eq("parentId", topicId);

  if (error) {
    console.error("Error fetching GroupFlashcardSets:", error);
    return [];
  }

  return groupFlashcardSets || [];
};

const LoadGroupFlashcardSetsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupTopicId } = useSelectedGroupTopic();

  useEffect(() => {
    const initializeGroupFlashcardSetEntities = async () => {
      if (selectedGroupTopicId) {
        const groupFlashcardSets = mockupData
          ? dummyFlashcardSets
          : shouldFetchFromSupabase
            ? await fetchGroupFlashcardSetsForTopic(selectedGroupTopicId)
            : [];

        groupFlashcardSets.forEach((groupFlashcardSet) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === groupFlashcardSet.id && e.hasTag(DataTypes.GROUP_FLASHCARD_SET)
          );

          if (!isExisting) {
            const noteEntity = new Entity();
            lsc.engine.addEntity(noteEntity);
            noteEntity.add(new TitleFacet({ title: groupFlashcardSet.flashcardSetName }));
            noteEntity.add(new IdentifierFacet({ guid: groupFlashcardSet.id }));
            noteEntity.add(new DateAddedFacet({ dateAdded: groupFlashcardSet.date_added }));
            noteEntity.add(new ParentFacet({ parentId: selectedGroupTopicId }));
            noteEntity.addTag(DataTypes.GROUP_FLASHCARD_SET);
          }
        });
      }
    };

    initializeGroupFlashcardSetEntities();
  }, [selectedGroupTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};
export default LoadGroupFlashcardSetsSystem
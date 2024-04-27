import React, { useContext, useEffect } from 'react'
import supabaseClient from '../../../lib/supabase';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet, DateAddedFacet } from '../../../app/AdditionalFacets';
import { dummyFlashcardSets, dummyNotes } from '../../../base/dummy';
import { DataTypes } from '../../../base/enums';
import { useSelectedTopic } from '../hooks/useSelectedTopic';


const fetchFlashcardSetsForTopic = async (topicId: string) => {
    const { data: flashcardSets, error } = await supabaseClient
      .from("flashcardets")
      .select("flashcardSetName, id, date_added")
      .eq("parentId", topicId);
  
    if (error) {
      console.error("Error fetching flashcardSets:", error);
      return [];
    }
  
    return flashcardSets || [];
  };
  
  const LoadFlashcardSetsSystem = (props: { mockupData?: boolean }) => {
    const { mockupData } = props;
    const lsc = useContext(LeanScopeClientContext);
    const { selectedTopicId } = useSelectedTopic();
  
    useEffect(() => {
      const initializeFlashcardSetEntities = async () => {
        if (selectedTopicId) {
          const flashcardSets = mockupData
            ? dummyFlashcardSets
            : await fetchFlashcardSetsForTopic(selectedTopicId);
  
          flashcardSets.forEach((flashcardSet) => {
            const isExisting = lsc.engine.entities.some(
              (e) =>
                e.get(IdentifierFacet)?.props.guid === flashcardSet.id &&
                e.hasTag(DataTypes.FLASHCARD_SET)
            );
  
            if (!isExisting) {
              const noteEntity = new Entity();
              lsc.engine.addEntity(noteEntity);
              noteEntity.add(new TitleFacet({ title: flashcardSet.flashcardSetName }));
              noteEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
              noteEntity.add(new DateAddedFacet({ dateAdded: flashcardSet.date_added }));
  
              noteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
              noteEntity.addTag(DataTypes.FLASHCARD_SET);
            }
          });
        }
      };
  
      initializeFlashcardSetEntities();
    }, [selectedTopicId]);
  
    return null;
  };
  
  export default LoadFlashcardSetsSystem;

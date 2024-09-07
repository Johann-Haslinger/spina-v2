import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
} from '../../../app/additionalFacets';
import { dummyFlashcards, dummyPodcasts } from '../../../base/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedSubtopic } from '../hooks/useSelectedSubtopic';

const fetchFlashcardsForSubtopic = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('question, id, answer, mastery_level')
    .eq(SupabaseColumn.PARENT_ID, parentId);

  if (error) {
    console.error('Error fetching subtopic flashcards:', error);
    return [];
  }

  return flashcards || [];
};
const fetchPodcastForSubtopic = async (parentId: string) => {
  const { data: podcast, error } = await supabaseClient
    .from(SupabaseTable.PODCASTS)
    .select('title, id, date_added')
    .eq(SupabaseColumn.PARENT_ID, parentId)
    .single();

  if (error) {
    console.error('Error fetching subtopic podcast:', error);
    return;
  }

  return podcast;
};

const LoadSubtopicResourcesSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedSubtopicId } = useSelectedSubtopic();

  useEffect(() => {
    const initializeSubtopicFlashcardEntities = async () => {
      if (selectedSubtopicId) {
        const flashcards = mockupData
          ? dummyFlashcards
          : shouldFetchFromSupabase
            ? await fetchFlashcardsForSubtopic(selectedSubtopicId)
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
            flashcardEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));

            flashcardEntity.addTag(DataType.FLASHCARD);
          }
        });
      }
    };

    const initializeSubtopicPodcast = async () => {
      if (selectedSubtopicId) {
        const podcast = mockupData
          ? dummyPodcasts[0]
          : shouldFetchFromSupabase
            ? await fetchPodcastForSubtopic(selectedSubtopicId)
            : null;

        if (podcast) {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataType.PODCAST),
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || '' }));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.date_added }));
            podcastEntity.addTag(DataType.PODCAST);
          }
        }
      }
    };

    initializeSubtopicPodcast();
    initializeSubtopicFlashcardEntities();
  }, [selectedSubtopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadSubtopicResourcesSystem;

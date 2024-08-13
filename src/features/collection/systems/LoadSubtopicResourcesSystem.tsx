import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
} from '../../../app/additionalFacets';
import { dummyFlashcards, dummyPodcasts, dummyText } from '../../../base/dummy';
import { DataTypes, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { useSelectedSubtopic } from '../hooks/useSelectedSubtopic';

const fetchNoteVersion = async (noteId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from(SupabaseTables.SUBTOPICS)
    .select('old_note_version, new_note_version')
    .eq(SupabaseColumns.ID, noteId)
    .single();

  if (error) {
    console.error('error fetching note version', error);
    return;
  }

  const isOldNoteVersion = noteVersionData?.old_note_version;
  const isNewNoteVersion = noteVersionData?.new_note_version;

  return isOldNoteVersion ? 'old-version' : isNewNoteVersion ? 'new-version' : 'blocks-version';
};

const fetchFlashcardsForSubtopic = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARDS)
    .select('question, id, answer, mastery_level')
    .eq(SupabaseColumns.PARENT_ID, parentId);

  if (error) {
    console.error('Error fetching subtopic flashcards:', error);
    return [];
  }

  return flashcards || [];
};
const fetchPodcastForSubtopic = async (parentId: string) => {
  const { data: podcast, error } = await supabaseClient
    .from(SupabaseTables.PODCASTS)
    .select('title, id, date_added')
    .eq(SupabaseColumns.PARENT_ID, parentId)
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
  const { selectedSubtopicId, selectedSubtopicEntity } = useSelectedSubtopic();
  const { userId } = useUserData();

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
            (e) => e.get(IdentifierFacet)?.props.guid === flashcard.id && e.hasTag(DataTypes.FLASHCARD),
          );

          if (!isExisting) {
            const flashcardEntity = new Entity();
            lsc.engine.addEntity(flashcardEntity);
            flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
            flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: flashcard.mastery_level }));
            flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
            flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
            flashcardEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));

            flashcardEntity.addTag(DataTypes.FLASHCARD);
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
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST),
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || '' }));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.date_added }));
            podcastEntity.addTag(DataTypes.PODCAST);
          }
        }
      }
    };

    const initializeSubtopicText = async () => {
      if (selectedSubtopicId) {
        let subtopicText;
        if (mockupData) {
          subtopicText = dummyText;
        } else if (shouldFetchFromSupabase) {
          const noteVersion = shouldFetchFromSupabase && (await fetchNoteVersion(selectedSubtopicId));

          if (noteVersion == 'old-version') {
            const { data: subtopicTextData, error } = await supabaseClient
              .from('knowledges')
              .select('text')
              .eq(SupabaseColumns.PARENT_ID, selectedSubtopicId)
              .single();

            if (error) {
              console.error('error fetching subtopic text', error);
              return;
            }
            subtopicText = subtopicTextData?.text;

            const { error: error2 } = await supabaseClient
              .from(SupabaseTables.SUBTOPICS)
              .update({ old_note_version: false })
              .eq(SupabaseColumns.ID, selectedSubtopicId);

            if (error2) {
              console.error('error updating subtopic to oldNoteVersion', error2);
            }
          } else if (noteVersion == 'blocks-version') {
            const { data: blocks, error } = await supabaseClient
              .from(SupabaseTables.BLOCKS)
              .select('content')
              .eq(SupabaseColumns.PARENT_ID, selectedSubtopicId);

            if (error) {
              console.error('error fetching blocks', error);
            }

            const text = blocks?.map((block) => block.content).join('\n');

            selectedSubtopicEntity?.add(new TextFacet({ text: text || '' }));

            const { error: error2 } = await supabaseClient
              .from(SupabaseTables.TEXTS)
              .upsert([{ text, parent_id: selectedSubtopicId, user_id: userId }]);

            if (error2) {
              console.error('error inserting text', error2);
            }

            const { error: error3 } = await supabaseClient
              .from(SupabaseTables.SUBTOPICS)
              .update({ old_note_version: false, new_note_version: true })
              .eq(SupabaseColumns.ID, selectedSubtopicId);

            if (error3) {
              console.error('error updating note to newNoteVersion', error3);
            }

            const { error: error4 } = await supabaseClient
              .from(SupabaseTables.BLOCKS)
              .delete()
              .eq(SupabaseColumns.PARENT_ID, selectedSubtopicId);

            if (error4) {
              console.error('error deleting blocks', error4);
            }
          }

          selectedSubtopicEntity?.add(new TextFacet({ text: subtopicText }));
        }
      }
    };

    initializeSubtopicText();
    initializeSubtopicPodcast();
    initializeSubtopicFlashcardEntities();
  }, [selectedSubtopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadSubtopicResourcesSystem;

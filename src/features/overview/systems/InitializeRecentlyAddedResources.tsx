import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { TitleFacet } from '../../../app/additionalFacets';
import { AdditionalTag, DataType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchRecentlyAddedSubtopics = async () => {
  const currentDate = new Date();
  const toDaysAgo = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const { data: subtopics, error } = await supabaseClient
    .from(SupabaseTable.SUBTOPICS)
    .select('title, id')
    .gte('date_added', toDaysAgo);

  if (error) {
    console.error('Error fetching recently added subtopics: ', error);
  }

  return subtopics || [];
};

const fetchRecentlyAddedNotes = async () => {
  const currentDate = new Date();
  const toDaysAgo = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const { data: notes, error } = await supabaseClient
    .from(SupabaseTable.NOTES)
    .select('title, id')
    .gte('date_added', toDaysAgo);

  if (error) {
    console.error('Error fetching recently added notes: ', error);
  }

  return notes || [];
};

const fetchRecentlyAddedFlashcardSets = async () => {
  const currentDate = new Date();
  const toDaysAgo = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const { data: flashcardSets, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SETS)
    .select('title, id')
    .gte('date_added', toDaysAgo);

  if (error) {
    console.error('Error fetching recently added flashcard sets: ', error);
  }

  return flashcardSets || [];
};

const InitializeRecentlyAddedResources = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();

  useEffect(() => {
    const initializeRecentlyAddedSubtopics = async () => {
      const subtopics = shouldFetchFromSupabase ? await fetchRecentlyAddedSubtopics() : [];

      subtopics.forEach((subtopic) => {
        lsc.engine.entities
          .filter((e) => e.has(DataType.SUBTOPIC) && e.get(IdentifierFacet)?.props.guid === subtopic.id)
          .forEach((e) => {
            lsc.engine.removeEntity(e);
          });

        const newSubtopicEntity = new Entity();
        lsc.engine.addEntity(newSubtopicEntity);
        newSubtopicEntity.add(new IdentifierFacet({ guid: subtopic.id }));
        newSubtopicEntity.add(new TitleFacet({ title: subtopic.title || 'Kein Titel' }));
        newSubtopicEntity.add(DataType.SUBTOPIC);
        newSubtopicEntity.add(AdditionalTag.RECENTLY_ADDED);
      });
    };

    const initializeRecentlyAddedNotes = async () => {
      const notes = shouldFetchFromSupabase ? await fetchRecentlyAddedNotes() : [];

      notes.forEach((note) => {
        lsc.engine.entities
          .filter((e) => e.has(DataType.NOTE) && e.get(IdentifierFacet)?.props.guid === note.id)
          .forEach((e) => {
            lsc.engine.removeEntity(e);
          });

        const newNoteEntity = new Entity();
        lsc.engine.addEntity(newNoteEntity);
        newNoteEntity.add(new IdentifierFacet({ guid: note.id }));
        newNoteEntity.add(new TitleFacet({ title: note.title || 'Kein Titel' }));
        newNoteEntity.add(DataType.NOTE);
        newNoteEntity.add(AdditionalTag.RECENTLY_ADDED);
      });
    };

    const initializeRecentlyAddedFlashcardSets = async () => {
      const flashcardSets = shouldFetchFromSupabase ? await fetchRecentlyAddedFlashcardSets() : [];

      flashcardSets.forEach((flashcardSet) => {
        lsc.engine.entities
          .filter((e) => e.has(DataType.FLASHCARD_SET) && e.get(IdentifierFacet)?.props.guid === flashcardSet.id)
          .forEach((e) => {
            lsc.engine.removeEntity(e);
          });

        const newFlashcardSetEntity = new Entity();
        lsc.engine.addEntity(newFlashcardSetEntity);
        newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
        newFlashcardSetEntity.add(new TitleFacet({ title: flashcardSet.title || 'Kein Titel' }));
        newFlashcardSetEntity.add(DataType.FLASHCARD_SET);
        newFlashcardSetEntity.add(AdditionalTag.RECENTLY_ADDED);
      });
    };

    initializeRecentlyAddedSubtopics();
    initializeRecentlyAddedNotes();
    initializeRecentlyAddedFlashcardSets();
  }, [shouldFetchFromSupabase]);

  return null;
};

export default InitializeRecentlyAddedResources;

import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/additionalFacets";
import { AdditionalTags, DataTypes, SupabaseTables } from "../../../base/enums";
import { useCurrentDataSource } from "../../../hooks/useCurrentDataSource";
import supabaseClient from "../../../lib/supabase";

const fetchRecentlyAddedSubtopics = async () => {
  const currentDate = new Date();
  const toDaysAgo = new Date(
    currentDate.getTime() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: subtopics, error } = await supabaseClient
    .from(SupabaseTables.SUBTOPICS)
    .select("title, id")
    .gte("date_added", toDaysAgo);

  if (error) {
    console.error("Error fetching recently added subtopics: ", error);
  }

  return subtopics || [];
};

const fetchRecentlyAddedNotes = async () => {
  const currentDate = new Date();
  const toDaysAgo = new Date(
    currentDate.getTime() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: notes, error } = await supabaseClient
    .from(SupabaseTables.NOTES)
    .select("title, id")
    .gte("date_added", toDaysAgo);

  if (error) {
    console.error("Error fetching recently added notes: ", error);
  }

  return notes || [];
};

const fetchRecentlyAddedFlashcardSets = async () => {
  const currentDate = new Date();
  const toDaysAgo = new Date(
    currentDate.getTime() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: flashcardSets, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARD_SETS)
    .select("title, id")
    .gte("date_added", toDaysAgo);

  if (error) {
    console.error("Error fetching recently added flashcard sets: ", error);
  }

  return flashcardSets || [];
};

const InitializeRecentlyAddedResources = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingSupabaseData: shouldFetchFromSupabase } =
    useCurrentDataSource();

  useEffect(() => {
    const initializeRecentlyAddedSubtopics = async () => {
      const subtopics = shouldFetchFromSupabase
        ? await fetchRecentlyAddedSubtopics()
        : [];

      subtopics.forEach((subtopic) => {
        lsc.engine.entities
          .filter(
            (e) =>
              e.has(DataTypes.SUBTOPIC) &&
              e.get(IdentifierFacet)?.props.guid === subtopic.id,
          )
          .forEach((e) => {
            lsc.engine.removeEntity(e);
          });

        const newSubtopicEntity = new Entity();
        lsc.engine.addEntity(newSubtopicEntity);
        newSubtopicEntity.add(new IdentifierFacet({ guid: subtopic.id }));
        newSubtopicEntity.add(
          new TitleFacet({ title: subtopic.title || "Kein Titel" }),
        );
        newSubtopicEntity.add(DataTypes.SUBTOPIC);
        newSubtopicEntity.add(AdditionalTags.RECENTLY_ADDED);
      });
    };

    const initializeRecentlyAddedNotes = async () => {
      const notes = shouldFetchFromSupabase
        ? await fetchRecentlyAddedNotes()
        : [];

      notes.forEach((note) => {
        lsc.engine.entities
          .filter(
            (e) =>
              e.has(DataTypes.NOTE) &&
              e.get(IdentifierFacet)?.props.guid === note.id,
          )
          .forEach((e) => {
            lsc.engine.removeEntity(e);
          });

        const newNoteEntity = new Entity();
        lsc.engine.addEntity(newNoteEntity);
        newNoteEntity.add(new IdentifierFacet({ guid: note.id }));
        newNoteEntity.add(
          new TitleFacet({ title: note.title || "Kein Titel" }),
        );
        newNoteEntity.add(DataTypes.NOTE);
        newNoteEntity.add(AdditionalTags.RECENTLY_ADDED);
      });
    };

    const initializeRecentlyAddedFlashcardSets = async () => {
      const flashcardSets = shouldFetchFromSupabase
        ? await fetchRecentlyAddedFlashcardSets()
        : [];

      flashcardSets.forEach((flashcardSet) => {
        lsc.engine.entities
          .filter(
            (e) =>
              e.has(DataTypes.FLASHCARD_SET) &&
              e.get(IdentifierFacet)?.props.guid === flashcardSet.id,
          )
          .forEach((e) => {
            lsc.engine.removeEntity(e);
          });

        const newFlashcardSetEntity = new Entity();
        lsc.engine.addEntity(newFlashcardSetEntity);
        newFlashcardSetEntity.add(
          new IdentifierFacet({ guid: flashcardSet.id }),
        );
        newFlashcardSetEntity.add(
          new TitleFacet({ title: flashcardSet.title || "Kein Titel" }),
        );
        newFlashcardSetEntity.add(DataTypes.FLASHCARD_SET);
        newFlashcardSetEntity.add(AdditionalTags.RECENTLY_ADDED);
      });
    };

    initializeRecentlyAddedSubtopics();
    initializeRecentlyAddedNotes();
    initializeRecentlyAddedFlashcardSets();
  }, [shouldFetchFromSupabase]);

  return null;
};

export default InitializeRecentlyAddedResources;

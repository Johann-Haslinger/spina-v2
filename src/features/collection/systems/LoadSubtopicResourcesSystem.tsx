import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
} from "../../../app/additionalFacets";
import { dummyFlashcards, dummyPodcasts, dummyText } from "../../../base/dummy";
import { DataTypes, SupabaseTables } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedSubtopic } from "../hooks/useSelectedSubtopic";

const fetchNoteVersion = async (noteId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from(SupabaseTables.SUBTOPICS)
    .select("old_note_version")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("error fetching note version", error);
    return;
  }
  return noteVersionData?.old_note_version;
};

const fetchFlashcardsForSubtopic = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARDS)
    .select("question, id, answer, mastery_level")
    .eq("parent_id", parentId);

  if (error) {
    console.error("Error fetching subtopic flashcards:", error);
    return [];
  }

  return flashcards || [];
};
const fetchPodcastForSubtopic = async (parentId: string) => {
  const { data: podcast, error } = await supabaseClient
    .from(SupabaseTables.PODCASTS)
    .select("title, id, date_added")
    .eq("parent_id", parentId)
    .single();

  if (error) {
    console.error("Error fetching subtopic podcast:", error);
    return;
  }

  return podcast;
};

const LoadSubtopicResourcesSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedSubtopicId, selectedSubtopicEntity } = useSelectedSubtopic();

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
            (e) => e.get(IdentifierFacet)?.props.guid === flashcard.id && e.hasTag(DataTypes.FLASHCARD)
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
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST)
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || "" }));
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
          const isOldNoteVersion = shouldFetchFromSupabase && (await fetchNoteVersion(selectedSubtopicId));

          if (isOldNoteVersion) {
            const { data: subtopicTextData, error } = await supabaseClient
              .from("knowledges")
              .select("text")
              .eq("parentId", selectedSubtopicId)
              .single();

            if (error) {
              console.error("error fetching subtopic text", error);
              return;
            }
            subtopicText = subtopicTextData?.text;

            const { error: error2 } = await supabaseClient
              .from(SupabaseTables.SUBTOPICS)
              .update({ old_note_version: false })
              .eq("id", selectedSubtopicId);

            if (error2) {
              console.error("error updating subtopic to oldNoteVersion", error2);
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

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
import { dummyFlashcards, dummyLernVideos, dummyPodcasts, dummyText } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedSubtopic } from "../hooks/useSelectedSubtopic";

const fetchNoteVersion = async (noteId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from("subTopics")
    .select("oldNoteVersion")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("error fetching note version", error);
    return;
  }
  return noteVersionData?.oldNoteVersion;
};

const fetchFlashcardsForSubtopic = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from("flashCards")
    .select("question, id, answer, difficulty")
    .eq("parentId", parentId);

  if (error) {
    console.error("Error fetching subtopic flashcards:", error);
    return [];
  }

  return flashcards || [];
};

const fetchLernVideosForSubtopic = async (parentId: string) => {
  const { data: lernVideo, error } = await supabaseClient
    .from("lernVideos")
    .select("title, id, createdAt")
    .eq("parentId", parentId);

  if (error) {
    console.error("Error fetching subtopic lernVideo:", error);
    return [];
  }

  return lernVideo || [];
};

const fetchPodcastForSubtopic = async (parentId: string) => {
  const { data: podcast, error } = await supabaseClient
    .from("podcasts")
    .select("title, id, createdAt")
    .eq("parentId", parentId)
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
            flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: flashcard.difficulty }));
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
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
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
          console.log("isOldNoteVersion", isOldNoteVersion);

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
              .from("subTopics")
              .update({ oldNoteVersion: false })
              .eq("id", selectedSubtopicId);

            if (error2) {
              console.error("error updating subtopic to oldNoteVersion", error2);
            }
          }

          selectedSubtopicEntity?.add(new TextFacet({ text: subtopicText }));
        }
      }
    };

    const initializeSubtopicLernVideo = async () => {
      if (selectedSubtopicId) {
        const lernVideos = mockupData
          ? dummyLernVideos
          : shouldFetchFromSupabase
          ? await fetchLernVideosForSubtopic(selectedSubtopicId)
          : [];

        lernVideos.forEach((lernVideo) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === lernVideo.id && e.hasTag(DataTypes.LERNVIDEO)
          );

          if (!isExisting) {
            const lernVideoEntity = new Entity();
            lsc.engine.addEntity(lernVideoEntity);
            lernVideoEntity.add(new IdentifierFacet({ guid: lernVideo.id }));
            lernVideoEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));
            lernVideoEntity.add(new TitleFacet({ title: lernVideo.title || "" }));
            lernVideoEntity.add(new DateAddedFacet({ dateAdded: lernVideo.createdAt }));
            lernVideoEntity.addTag(DataTypes.LERNVIDEO);
          }
        });
      }
    };
    if (false) {
      initializeSubtopicLernVideo();
    }
    initializeSubtopicText();
    initializeSubtopicPodcast();
    initializeSubtopicFlashcardEntities();
  }, [selectedSubtopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadSubtopicResourcesSystem;

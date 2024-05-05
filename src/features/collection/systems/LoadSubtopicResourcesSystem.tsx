import { useContext, useEffect } from "react";
import { useSelectedSubtopic } from "../hooks/useSelectedSubtopic";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { dummyFlashcards, dummyText } from "../../../base/dummy";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import {
  MasteryLevelFacet,
  QuestionFacet,
  AnswerFacet,
  TitleFacet,
  DateAddedFacet,
} from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";

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

const LoadSubtopicResourcesSystem = () => {
  const { mockupData } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedSubtopicId, selectedSubtopicEntity } = useSelectedSubtopic();

  useEffect(() => {
    const initializeSubtopicFlashcardEntities = async () => {
      if (selectedSubtopicId) {
        const flashcards = mockupData ? dummyFlashcards : await fetchFlashcardsForSubtopic(selectedSubtopicId);

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
        const { data: podcast, error } = await supabaseClient
          .from("podcasts")
          .select("title, id, createdAt")
          .eq("parentId", selectedSubtopicId)
          .single();

        if (error) {
          console.error("Error fetching subtopic podcast:", error);
          return;
        }

        if (podcast) {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST)
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedSubtopicId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || ""}));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
            podcastEntity.addTag(DataTypes.PODCAST);
          }
        }
      }
    };

    const initializeSubtopicText = async () => {
      let subtopicText;
      if (mockupData) {
        subtopicText = dummyText;
      } else {
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
      }

      selectedSubtopicEntity?.add(new TextFacet({ text: subtopicText }));
    };

    initializeSubtopicText();
    initializeSubtopicPodcast();
    initializeSubtopicFlashcardEntities();
  }, [selectedSubtopicId, mockupData]);

  return null;
};

export default LoadSubtopicResourcesSystem;

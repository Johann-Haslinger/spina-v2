import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import {
  AnswerFacet,
  MasteryLevelFacet,
  QuestionFacet,
} from "../../../app/additionalFacets";
import { dummyFlashcards } from "../../../base/dummy";
import {
  DataTypes,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { dataTypeQuery } from "../../../utils/queries";

const fetchFlashcardsForFlashcardGroup = async (parentId: string) => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARDS)
    .select("question, id, answer, mastery_level")
    .eq(SupabaseColumns.PARENT_ID, parentId);

  if (error) {
    console.error("Error fetching flashcards:", error);
    return [];
  }

  return flashcards || [];
};

const LoadFlashcardsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const [selectedFlashcardGroupEntity] = useEntity(
    (e) =>
      (dataTypeQuery(e, DataTypes.FLASHCARD_GROUP) ||
        dataTypeQuery(e, DataTypes.FLASHCARD_SET)) &&
      e.hasTag(Tags.SELECTED),
  );
  const selectedFlashcardGroupId =
    selectedFlashcardGroupEntity?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const initializeFlashcardEntities = async () => {
      if (selectedFlashcardGroupId) {
        const flashcards = mockupData
          ? dummyFlashcards
          : shouldFetchFromSupabase
            ? await fetchFlashcardsForFlashcardGroup(selectedFlashcardGroupId)
            : [];

        flashcards.forEach((flashcard) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === flashcard.id &&
              e.hasTag(DataTypes.FLASHCARD),
          );

          if (!isExisting) {
            const flashcardEntity = new Entity();
            lsc.engine.addEntity(flashcardEntity);
            flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
            flashcardEntity.add(
              new MasteryLevelFacet({ masteryLevel: flashcard.mastery_level }),
            );
            flashcardEntity.add(
              new QuestionFacet({ question: flashcard.question }),
            );
            flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
            flashcardEntity.add(
              new ParentFacet({ parentId: selectedFlashcardGroupId }),
            );

            flashcardEntity.addTag(DataTypes.FLASHCARD);
          }
        });
      }
    };

    initializeFlashcardEntities();
  }, [selectedFlashcardGroupId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadFlashcardsSystem;

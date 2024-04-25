import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntity } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  ParentFacet,
  Tags,
} from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from "../../../app/AdditionalFacets";
import { dummyFlashcards } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import supabase from "../../../lib/supabase";
import { dataTypeQuery } from "../../../utils/queries";

const fetchFlashcardsForFlashcardGroup = async (parentId: string) => {
  const { data: flashcards, error } = await supabase
    .from("flashCards")
    .select("question, id, answer, difficulty")
    .eq("parentId", parentId);

  if (error) {
    console.error("Error fetching flashcards:", error);
    return [];
  }

  return flashcards || [];
};

const LoadFlashcardsSystem = (props: { mockupData?: boolean }) => {
  const { mockupData } = props;
  const lsc = useContext(LeanScopeClientContext);
  const [selectedFlashcardGroupEntity] = useEntity(
    (e) =>
      dataTypeQuery(e, DataTypes.FLASHCARD_GROUP) && e.hasTag(Tags.SELECTED)
  );
  const selectedFlashcardGroupId =
    selectedFlashcardGroupEntity?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const initializeFlashcardEntities = async () => {
      if (selectedFlashcardGroupId) {
        const flashcards = mockupData
          ? dummyFlashcards
          : await fetchFlashcardsForFlashcardGroup(selectedFlashcardGroupId);

        flashcards.forEach((flashcard) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === flashcard.id &&
              e.hasTag(DataTypes.FLASHCARD)
          );

          if (!isExisting) {
            const flashcardEntity = new Entity();
            lsc.engine.addEntity(flashcardEntity);
            flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
            flashcardEntity.add(
              new MasteryLevelFacet({ masteryLevel: flashcard.difficulty })
            );
            flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
            flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
            flashcardEntity.add(new ParentFacet({ parentId: selectedFlashcardGroupId }));

            flashcardEntity.addTag(DataTypes.FLASHCARD);
          }
        });
      }
    };

    initializeFlashcardEntities();
  }, [selectedFlashcardGroupId]);

  return null;
};

export default LoadFlashcardsSystem;

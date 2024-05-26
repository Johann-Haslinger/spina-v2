import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { AnswerFacet, QuestionFacet } from "../app/additionalFacets";

export const addGroupFlashcards = async (
  lsc: ILeanScopeClient,
  flashcardEntities: Entity[],
  userId: string,
  learningGroupId: string
) => {
  flashcardEntities.forEach((flashcardEntity) => {
    lsc.engine.addEntity(flashcardEntity);
  });

  const { error } = await supabaseClient.from("group_flashcards").insert(
    flashcardEntities.map((flashcardEntity) => ({
      question: flashcardEntity.get(QuestionFacet)?.props.question,
      answer: flashcardEntity.get(AnswerFacet)?.props.answer,
      parent_id: flashcardEntity.get(ParentFacet)?.props.parentId,
      id: flashcardEntity.get(IdentifierFacet)?.props.guid,
      creator_id: userId,
      learning_group_id: learningGroupId,
    }))
  );

  if (error) {
    console.error("Error inserting flashcard", error);
  }
};

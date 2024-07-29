import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { AnswerFacet, QuestionFacet } from "../app/additionalFacets";
import { SupabaseTables } from "../base/enums";

export const addFlashcards = async (
  lsc: ILeanScopeClient,
  flashcardEntities: Entity[],
  userId: string,
) => {
  flashcardEntities.forEach((flashcardEntity) => {
    lsc.engine.addEntity(flashcardEntity);
  });

  const { error } = await supabaseClient.from(SupabaseTables.FLASHCARDS).insert(
    flashcardEntities.map((flashcardEntity) => ({
      question: flashcardEntity.get(QuestionFacet)?.props.question,
      answer: flashcardEntity.get(AnswerFacet)?.props.answer,
      parent_id: flashcardEntity.get(ParentFacet)?.props.parentId,
      id: flashcardEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
    })),
  );

  if (error) {
    console.error("Error inserting flashcard", error);
  }
};

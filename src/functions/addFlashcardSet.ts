import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import supabaseClient from "../lib/supabase";
import { SupabaseTables } from "../base/enums";

export const addFlashcardSet = async (lsc: ILeanScopeClient, flashcardSetEntity: Entity, userId: string) => {
  lsc.engine.addEntity(flashcardSetEntity);

  const { error } = await supabaseClient.from(SupabaseTables.FLASHCARD_SETS).insert([
    {
      id: flashcardSetEntity.get(IdentifierFacet)?.props.guid,
      parent_id: flashcardSetEntity.get(ParentFacet)?.props.parentId,
      title: flashcardSetEntity.get(TitleFacet)?.props.title,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error("Error inserting flashcardSet", error);
  }
};

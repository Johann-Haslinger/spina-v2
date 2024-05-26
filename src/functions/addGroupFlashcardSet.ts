import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import supabaseClient from "../lib/supabase";

export const addGroupFlashcardSet = async (lsc: ILeanScopeClient, flashcardSetEntity: Entity, userId: string, learningGroupId: string) => {
  lsc.engine.addEntity(flashcardSetEntity);

  const { error } = await supabaseClient.from("group_flashcard_sets").insert([
    {
      id: flashcardSetEntity.get(IdentifierFacet)?.props.guid,
      parent_id: flashcardSetEntity.get(ParentFacet)?.props.parentId,
      title: flashcardSetEntity.get(TitleFacet)?.props.title,
      creator_id: userId,
      learningGroupId: learningGroupId
    },
  ]);

  if (error) {
    console.error("Error inserting group flashcard set", error);
  }
};


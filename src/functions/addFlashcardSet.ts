import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import supabaseClient from "../lib/supabase";

export const addFlashcardSet = async (lsc: ILeanScopeClient, flashcardSetEntity: Entity, userId: string) => {
  lsc.engine.addEntity(flashcardSetEntity);

  console.log("adding flashcardSetEntity", flashcardSetEntity);

  const { error } = await supabaseClient.from("flashcardSets").insert([
    {
      id: flashcardSetEntity.get(IdentifierFacet)?.props.guid,
      parentId: flashcardSetEntity.get(ParentFacet)?.props.parentId,
      flashcardSetName: flashcardSetEntity.get(TitleFacet)?.props.title,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error("Error inserting flashcardSet", error);
  }
};

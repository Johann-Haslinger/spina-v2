import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { ParentFacet, IdentifierFacet } from "@leanscope/ecs-models";

export const addBlocks = async (lsc: ILeanScopeClient, blockEntities: Entity[], userId: string) => {
  blockEntities.forEach((blockEntity) => {
    lsc.engine.addEntity(blockEntity);
  });

  const { error } = await supabaseClient.from("flashCards").insert(
    blockEntities.map((blockEntity) => ({
      parentId: blockEntity.get(ParentFacet)?.props.parentId,
      id: blockEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
      
    }))
  );

  if (error) {
    console.error("Error inserting flashcard", error);
  }
};

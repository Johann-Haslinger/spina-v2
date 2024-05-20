import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../../../lib/supabase";
import { IdentifierFacet } from "@leanscope/ecs-models";

export const deleteBlock = async (lsc: ILeanScopeClient, blockEntity: Entity) => {
  lsc.engine.removeEntity(blockEntity);

  const blockId = blockEntity.get(IdentifierFacet)?.props.guid;
  const { error } = await supabaseClient.from("blocks").delete().eq("id", blockId);

  if (error) {
    console.error("Error deleting block from supabase", error);
  }
};

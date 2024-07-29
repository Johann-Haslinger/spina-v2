import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { SupabaseColumns, SupabaseTables } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";

export const deleteBlock = async (
  lsc: ILeanScopeClient,
  blockEntity: Entity,
) => {
  lsc.engine.removeEntity(blockEntity);

  const blockId = blockEntity.get(IdentifierFacet)?.props.guid;
  const { error } = await supabaseClient
    .from(SupabaseTables.BLOCKS)
    .delete()
    .eq(SupabaseColumns.ID, blockId);

  if (error) {
    console.error("Error deleting block from supabase", error);
  }
};

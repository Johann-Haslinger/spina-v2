import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { SupabaseColumn, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

export const deleteBlock = async (lsc: ILeanScopeClient, blockEntity: Entity) => {
  lsc.engine.removeEntity(blockEntity);

  const blockId = blockEntity.get(IdentifierFacet)?.props.guid;
  const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).delete().eq(SupabaseColumn.ID, blockId);

  if (error) {
    console.error('Error deleting block from supabase', error);
  }
};

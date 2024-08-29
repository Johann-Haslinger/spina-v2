import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, TextFacet } from '@leanscope/ecs-models';
import { SupabaseColumn, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

export const updateBlocktext = async (entity: Entity, text: string) => {
  entity.add(new TextFacet({ text: text }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).update({ content: text }).eq(SupabaseColumn.ID, id);

  if (error) {
    console.error('Error updating block text', error);
  }
};

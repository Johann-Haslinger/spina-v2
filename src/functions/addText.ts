import { Entity } from '@leanscope/ecs-engine';
import { ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addText = async (textEntity: Entity, userId: string) => {
  const parentId = textEntity.get(ParentFacet)?.props.parentId;
  const text = textEntity.get(TextFacet)?.props.text;

  const { error } = await supabaseClient.from(SupabaseTable.TEXTS).insert([
    {
      parent_id: parentId,
      text: text,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error('Error adding text', error);
  }
};

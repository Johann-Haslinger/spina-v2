import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../app/additionalFacets';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addNote = async (lsc: ILeanScopeClient, noteEntity: Entity, userId: string) => {
  lsc.engine.addEntity(noteEntity);

  const { error } = await supabaseClient.from(SupabaseTable.NOTES).insert([
    {
      id: noteEntity.get(IdentifierFacet)?.props.guid,
      parent_id: noteEntity.get(ParentFacet)?.props.parentId,
      title: noteEntity.get(TitleFacet)?.props.title,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error('Error inserting note', error);
  }
};

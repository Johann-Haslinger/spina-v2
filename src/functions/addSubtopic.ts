import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../app/additionalFacets';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addSubtopic = async (lsc: ILeanScopeClient, subtopicEntity: Entity, userId: string) => {
  lsc.engine.addEntity(subtopicEntity);

  const subtopicId = subtopicEntity.get(IdentifierFacet)?.props.guid;
  const parentId = subtopicEntity.get(ParentFacet)?.props.parentId;
  const title = subtopicEntity.get(TitleFacet)?.props.title;

  const { error } = await supabaseClient.from(SupabaseTable.SUBTOPICS).insert([
    {
      id: subtopicId,
      parent_id: parentId,
      title: title,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error('Error adding subtopic', error);
  }
};

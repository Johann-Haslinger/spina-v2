import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../app/additionalFacets';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addGroupSubtopic = async (
  lsc: ILeanScopeClient,
  subtopicEntity: Entity,
  userId: string,
  learningGroupId: string,
) => {
  lsc.engine.addEntity(subtopicEntity);

  const { error } = await supabaseClient.from(SupabaseTable.GROUP_SUBTOPICS).insert([
    {
      id: subtopicEntity.get(IdentifierFacet)?.props.guid,
      parent_id: subtopicEntity.get(ParentFacet)?.props.parentId,
      title: subtopicEntity.get(TitleFacet)?.props.title,
      creator_id: userId,
      group_id: learningGroupId,
    },
  ]);

  if (error) {
    console.error('Error inserting group subtopic', error);
  }
};

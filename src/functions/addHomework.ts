import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { DueDateFacet, RelationshipFacet, TitleFacet } from '../app/additionalFacets';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addHomework = async (lsc: ILeanScopeClient, homeworkEntity: Entity, userId: string) => {
  lsc.engine.addEntity(homeworkEntity);

  const { error } = await supabaseClient.from(SupabaseTable.HOMEWORKS).insert([
    {
      id: homeworkEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
      title: homeworkEntity.get(TitleFacet)?.props.title,
      parent_id: homeworkEntity.get(ParentFacet)?.props.parentId || null,
      text: homeworkEntity.get(DescriptionFacet)?.props.description,
      due_date: homeworkEntity.get(DueDateFacet)?.props.dueDate,
      status: 1,
      related_subject: homeworkEntity.get(RelationshipFacet)?.props.relationship,
    },
  ]);

  if (error) {
    console.error('Error inserting homework', error);
  }
};

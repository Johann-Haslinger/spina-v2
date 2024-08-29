import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { DueDateFacet, RelationshipFacet, TitleFacet } from '../app/additionalFacets';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addExam = async (lsc: ILeanScopeClient, examEntity: Entity, userId: string) => {
  lsc.engine.addEntity(examEntity);

  const { error } = await supabaseClient.from(SupabaseTable.EXAMS).insert([
    {
      id: examEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
      title: examEntity.get(TitleFacet)?.props.title,
      parent_id: examEntity.get(ParentFacet)?.props.parentId,
      due_date: examEntity.get(DueDateFacet)?.props.dueDate,
      status: 1,
      related_subject: examEntity.get(RelationshipFacet)?.props.relationship,
    },
  ]);

  if (error) {
    console.error('Error inserting exam', error);
  }
};

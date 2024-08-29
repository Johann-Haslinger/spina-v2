import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { SupabaseColumn, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

export const useHomeworkStatus = () => {
  const updateHomeworkStatus = async (homeworkEntity: Entity, status: number) => {
    const homeworkId = homeworkEntity.get(IdentifierFacet)?.props.guid;
    const { error } = await supabaseClient
      .from(SupabaseTable.HOMEWORKS)
      .update({ status })
      .eq(SupabaseColumn.ID, homeworkId);
    if (error) {
      console.error('Error updating homework status', error);
    }
  };

  return { updateHomeworkStatus };
};

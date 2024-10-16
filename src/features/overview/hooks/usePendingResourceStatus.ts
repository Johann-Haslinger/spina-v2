import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';

const usePendingResourceStatus = () => {
  const updatePendingResourceStatus = async (pendingEntity: Entity, status: number) => {
    const homeworkId = pendingEntity.get(IdentifierFacet)?.props.guid;

    if (pendingEntity.hasTag(DataType.HOMEWORK)) {
      const { error } = await supabaseClient
        .from(SupabaseTable.HOMEWORKS)
        .update({ status })
        .eq(SupabaseColumn.ID, homeworkId);
      if (error) {
        console.error('Error updating homework status', error);
      }
    } else if (pendingEntity.hasTag(DataType.EXAM)) {
      const { error } = await supabaseClient
        .from(SupabaseTable.EXAMS)
        .update({ status })
        .eq(SupabaseColumn.ID, homeworkId);
      if (error) {
        console.error('Error updating exam status', error);
      }
    }
  };

  return { updatePendingResourceStatus };
};

export default usePendingResourceStatus;

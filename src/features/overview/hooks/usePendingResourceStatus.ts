import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { DataTypes, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

const usePendingResourceStatus = () => {
  const updatePendingResourceStatus = async (pendingEntity: Entity, status: number) => {
    const homeworkId = pendingEntity.get(IdentifierFacet)?.props.guid;

    if (pendingEntity.hasTag(DataTypes.HOMEWORK)) {
      const { error } = await supabaseClient
        .from(SupabaseTables.HOMEWORKS)
        .update({ status })
        .eq(SupabaseColumns.ID, homeworkId);
      if (error) {
        console.error('Error updating homework status', error);
      }
    } else if (pendingEntity.hasTag(DataTypes.EXAM)) {
      const { error } = await supabaseClient
        .from(SupabaseTables.EXAMS)
        .update({ status })
        .eq(SupabaseColumns.ID, homeworkId);
      if (error) {
        console.error('Error updating exam status', error);
      }
    }
  };

  return { updatePendingResourceStatus };
};

export default usePendingResourceStatus;

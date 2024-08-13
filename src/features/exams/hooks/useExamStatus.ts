import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { SupabaseColumns, SupabaseTables } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

export const useExamStatus = () => {
  const updateExamStatus = async (examEntity: Entity, status: number) => {
    const examId = examEntity.get(IdentifierFacet)?.props.guid;
    const { error } = await supabaseClient.from(SupabaseTables.EXAMS).update({ status }).eq(SupabaseColumns.ID, examId);
    if (error) {
      console.error('Error updating exam status', error);
    }
  };

  return { updateExamStatus };
};

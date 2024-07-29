import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { SupabaseColumns, SupabaseTables } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";

export const useHomeworkStatus = () => {
  const updateHomeworkStatus = async (
    homeworkEntity: Entity,
    status: number,
  ) => {
    const homeworkId = homeworkEntity.get(IdentifierFacet)?.props.guid;
    const { error } = await supabaseClient
      .from(SupabaseTables.HOMEWORKS)
      .update({ status })
      .eq(SupabaseColumns.ID, homeworkId);
    if (error) {
      console.error("Error updating homework status", error);
    }
  };

  return { updateHomeworkStatus };
};

import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import supabaseClient from "../../../lib/supabase";

export const useExamStatus = () => {
  const updateExamStatus = async (examEntity: Entity, status: number) => {
    const examId = examEntity.get(IdentifierFacet)?.props.guid;
    const { error } = await supabaseClient.from("exams").update({ status }).eq("id", examId);
    if (error) {
      console.error("Error updating exam status", error);
    }
  };

  return { updateExamStatus };
};

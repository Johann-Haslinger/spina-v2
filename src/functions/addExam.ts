import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { DescriptionFacet, IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { SupabaseTables } from "../base/enums";
import supabaseClient from "../lib/supabase";
import { RelationshipFacet, TitleFacet } from "../app/additionalFacets";

export const addExam = async (lsc: ILeanScopeClient, examEntity: Entity, userId: string) => {
  lsc.engine.addEntity(examEntity);

  const { error } = await supabaseClient.from(SupabaseTables.HOMEWORKS).insert([
    {
      id: examEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
      title: examEntity.get(TitleFacet)?.props.title,
      parent_id: examEntity.get(ParentFacet)?.props.parentId,
      text: examEntity.get(DescriptionFacet)?.props.description,
      due_date: new Date().toISOString(),
      status: 1,
      related_subject: examEntity.get(RelationshipFacet)?.props.relationship,
    },
  ]);

  if (error) {
    console.error("Error inserting exam", error);
  }
};

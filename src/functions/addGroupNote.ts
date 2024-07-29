import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import { SupabaseTables } from "../base/enums";

export const addGroupNote = async (
  lsc: ILeanScopeClient,
  noteEntity: Entity,
  userId: string,
  learningGroupId: string,
) => {
  lsc.engine.addEntity(noteEntity);

  const { error } = await supabaseClient
    .from(SupabaseTables.GROUP_NOTES)
    .insert([
      {
        id: noteEntity.get(IdentifierFacet)?.props.guid,
        parent_id: noteEntity.get(ParentFacet)?.props.parentId,
        title: noteEntity.get(TitleFacet)?.props.title,
        creator_id: userId,
        group_id: learningGroupId,
      },
    ]);

  if (error) {
    console.error("Error inserting group note", error);
  }
};

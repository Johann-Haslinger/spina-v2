import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import { SupabaseTables } from "../base/enums";

export const addNote = async (
  lsc: ILeanScopeClient,
  noteEntity: Entity,
  userId: string,
) => {
  lsc.engine.addEntity(noteEntity);

  const { error } = await supabaseClient.from(SupabaseTables.NOTES).insert([
    {
      id: noteEntity.get(IdentifierFacet)?.props.guid,
      parent_id: noteEntity.get(ParentFacet)?.props.parentId,
      title: noteEntity.get(TitleFacet)?.props.title,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error("Error inserting note", error);
  }
};

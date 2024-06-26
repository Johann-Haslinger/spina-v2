import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { SupabaseTables } from "../base/enums";
import supabaseClient from "../lib/supabase";

export const addText = async (lsc: ILeanScopeClient, textEntity: Entity, userId: string) => {
  lsc.engine.addEntity(textEntity);

  const textId = textEntity.get(IdentifierFacet)?.props.guid;
  const parentId = textEntity.get(ParentFacet)?.props.parentId;
  const text = textEntity.get(TextFacet)?.props.text;

  const { error } = await supabaseClient.from(SupabaseTables.TEXTS).insert([
    {
      id: textId,
      parent_id: parentId,
      text: text,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error("Error adding text", error);
  }
};

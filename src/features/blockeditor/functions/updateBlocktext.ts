import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, TextFacet } from "@leanscope/ecs-models";
import supabaseClient from "../../../lib/supabase";
import { SupabaseTables } from "../../../base/enums";

export const updateBlocktext = async (entity: Entity, text: string) => {
  entity.add(new TextFacet({ text: text }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from(SupabaseTables.BLOCKS).update({ content: text }).eq("id", id);

  if (error) {
    console.error("Error updating block text", error);
  }
};

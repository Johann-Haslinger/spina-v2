import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, TextFacet } from "@leanscope/ecs-models";
import supabaseClient from "../../../lib/supabase";

export const updateBlocktext = async (entity: Entity, text: string) => {
  entity.add(new TextFacet({ text: text }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from("blocks").update({ content: text }).eq("id", id);

  if (error) {
    console.error("Error updating block text", error);
  }
};

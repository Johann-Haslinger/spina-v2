import { Entity } from "@leanscope/ecs-engine";
import { TextFacet } from "@leanscope/ecs-models";

export const updateBlocktext = async (entity: Entity, text: string) => {
  entity.add(new TextFacet({ text: text }));

  // const { error } = await supabaseClient
  //   .from("blocks")
  //   .update({
  //     content: text,
  //   })
  //   .eq("id", blockId);

  // if (error) {
  //   console.error("Error updating block text", error);
  // }
};

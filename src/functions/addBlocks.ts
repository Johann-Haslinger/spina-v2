import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import {
  ParentFacet,
  IdentifierFacet,
  FloatOrderFacet,
  ImageFacet,
  ImageFitFacet,
  ImageSizeFacet,
  TextFacet,
} from "@leanscope/ecs-models";
import {
  BlocktypeFacet,
  TodoStateFacet,
  ListStyleFacet,
  TexttypeFacet,
} from "../app/additionalFacets";
import { SupabaseTables } from "../base/enums";

export const addBlocks = async (
  lsc: ILeanScopeClient,
  blockEntities: Entity[],
  userId: string,
) => {
  blockEntities.forEach((blockEntity) => {
    lsc.engine.addEntity(blockEntity);
  });

  const { error } = await supabaseClient.from(SupabaseTables.BLOCKS).insert(
    blockEntities.map((blockEntity) => ({
      parent_id: blockEntity.get(ParentFacet)?.props.parentId,
      id: blockEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
      type: blockEntity.get(BlocktypeFacet)?.props.blocktype,
      order: blockEntity.get(FloatOrderFacet)?.props.index,
      state: blockEntity.get(TodoStateFacet)?.props.todoState,
      list_style: blockEntity.get(ListStyleFacet)?.props.listStyle,
      text_type: blockEntity.get(TexttypeFacet)?.props.texttype,
      content: blockEntity.get(TextFacet)?.props.text,
      fit: blockEntity.get(ImageFitFacet)?.props.fit,
      size: blockEntity.get(ImageSizeFacet)?.props.size,
      image_url: blockEntity.get(ImageFacet)?.props.imageSrc,
    })),
  );

  if (error) {
    console.error("Error inserting block", error);
  }
};

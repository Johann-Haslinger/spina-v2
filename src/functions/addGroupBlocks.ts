import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { ParentFacet, IdentifierFacet, FloatOrderFacet, ImageFacet, ImageFitFacet, ImageSizeFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet, TodoStateFacet, ListStyleFacet, TexttypeFacet } from "../app/additionalFacets";

export const addGroupsBlocks = async (lsc: ILeanScopeClient, blockEntities: Entity[], userId: string, learningGroupId: string) => {
  blockEntities.forEach((blockEntity) => {
    lsc.engine.addEntity(blockEntity);
  });

  const { error } = await supabaseClient.from("group_blocks").insert(
    blockEntities.map((blockEntity) => ({
      parentId: blockEntity.get(ParentFacet)?.props.parentId,
      id: blockEntity.get(IdentifierFacet)?.props.guid,
      creator_id: userId,
      type: blockEntity.get(BlocktypeFacet)?.props.blocktype,
      order: blockEntity.get(FloatOrderFacet)?.props.index,
      state: blockEntity.get(TodoStateFacet)?.props.todoState,
      listStyle: blockEntity.get(ListStyleFacet)?.props.listStyle,
      textType: blockEntity.get(TexttypeFacet)?.props.texttype,
      content: blockEntity.get(TextFacet)?.props.text,
      fit: blockEntity.get(ImageFitFacet)?.props.fit,
      size: blockEntity.get(ImageSizeFacet)?.props.size,
      imageUrl: blockEntity.get(ImageFacet)?.props.imageSrc,
      learning_group_id: learningGroupId
    }))
  );

  if (error) {
    console.error("Error inserting flashcard", error);
  }
};

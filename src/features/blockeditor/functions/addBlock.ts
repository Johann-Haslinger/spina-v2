import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import {
  FloatOrderFacet,
  IdentifierFacet,
  ImageFacet,
  ImageFitFacet,
  ImageSizeFacet,
  ParentFacet,
  TextFacet,
} from "@leanscope/ecs-models";
import { BlocktypeFacet, ListStyleFacet, TexttypeFacet, TodoStateFacet } from "../../../app/additionalFacets";
import supabaseClient from "../../../lib/supabase";
import { SupabaseTables } from "../../../base/enums";

export const addBlock = async (lsc: ILeanScopeClient, newBlockEntity: Entity, userId: string) => {
  lsc.engine.addEntity(newBlockEntity);

  const user_id = userId;
  const id = newBlockEntity.get(IdentifierFacet)?.props.guid;
  const type = newBlockEntity.get(BlocktypeFacet)?.props.blocktype;
  const order = newBlockEntity.get(FloatOrderFacet)?.props.index;
  const parentId = newBlockEntity.get(ParentFacet)?.props.parentId;
  const imageUrl = newBlockEntity.get(ImageFacet)?.props.imageSrc;
  const size = newBlockEntity.get(ImageSizeFacet)?.props.size;
  const fit = newBlockEntity.get(ImageFitFacet)?.props.fit;
  const content = newBlockEntity.get(TextFacet)?.props.text;
  const textType = newBlockEntity.get(TexttypeFacet)?.props.texttype;
  const listStyle = newBlockEntity.get(ListStyleFacet)?.props.listStyle;
  const state = newBlockEntity.get(TodoStateFacet)?.props.todoState;

  const { error } = await supabaseClient.from(SupabaseTables.BLOCKS).insert({
    id,
    type,
    order,
    parent_id: parentId,
    image_url: imageUrl,
    size,
    fit,
    content,
    text_type: textType,
    list_style: listStyle,
    state,
    user_id,
  });

  if (error) {
    console.error("Error adding block to supabase:", error);
  }
};

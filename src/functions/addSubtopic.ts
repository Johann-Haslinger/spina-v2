import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import supabaseClient from "../lib/supabase";

export const addSubtopic = async (lsc: ILeanScopeClient, subtopicEntity: Entity, userId: string) => {
  lsc.engine.addEntity(subtopicEntity);

  const subtopicId = subtopicEntity.get(IdentifierFacet)?.props.guid;
  const parentId = subtopicEntity.get(ParentFacet)?.props.parentId;
  const title = subtopicEntity.get(TitleFacet)?.props.title;

  const { error } = await supabaseClient.from("subTopics").insert([
    {
      id: subtopicId,
      parentId,
      name: title,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error("Error adding subtopic", error);
  }
};

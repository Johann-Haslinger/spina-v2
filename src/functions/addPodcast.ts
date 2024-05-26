import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";

export const addPodcast = async (lsc: ILeanScopeClient, podcastEntity: Entity, userId: string) => {
  lsc.engine.addEntity(podcastEntity);

  const { error } = await supabaseClient
    .from("podcasts")
    .insert([
      {
        parentId: podcastEntity.get(ParentFacet)?.props.parentId,
        user_id: userId,
        id: podcastEntity.get(IdentifierFacet)?.props.guid,
      },
    ]);

    if (error) {
      console.error("Error inserting podcast", error)
    }
};

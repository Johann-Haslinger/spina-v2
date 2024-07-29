import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import { SupabaseTables } from "../base/enums";
import supabaseClient from "../lib/supabase";

export const addPodcast = async (
  lsc: ILeanScopeClient,
  podcastEntity: Entity,
  userId: string,
  audioBase64: string,
) => {
  lsc.engine.addEntity(podcastEntity);

  const { error } = await supabaseClient.from(SupabaseTables.PODCASTS).insert([
    {
      parent_id: podcastEntity.get(ParentFacet)?.props.parentId,
      user_id: userId,
      id: podcastEntity.get(IdentifierFacet)?.props.guid,
      audio: audioBase64,
      title: podcastEntity.get(TitleFacet)?.props.title,
    },
  ]);

  if (error) {
    console.error("Error inserting podcast", error);
  }
};

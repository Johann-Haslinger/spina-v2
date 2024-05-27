import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../lib/supabase";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { SupabaseTables } from "../base/enums";
import { SourceFacet, TitleFacet } from "../app/additionalFacets";

export const addPodcast = async (lsc: ILeanScopeClient, podcastEntity: Entity, userId: string) => {
  lsc.engine.addEntity(podcastEntity);

  const { error } = await supabaseClient.from(SupabaseTables.PODCASTS).insert([
    {
      parent_id: podcastEntity.get(ParentFacet)?.props.parentId,
      user_id: userId,
      id: podcastEntity.get(IdentifierFacet)?.props.guid,
      audio: podcastEntity.get(SourceFacet)?.props.source,
      title: podcastEntity.get(TitleFacet)?.props.title,
    },
  ]);

  if (error) {
    console.error("Error inserting podcast", error);
  }
};

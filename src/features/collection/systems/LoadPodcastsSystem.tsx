import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext, useEffect } from "react";
import supabaseClient from "../../../lib/supabase";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories } from "../../../base/enums";
import { Entity } from "@leanscope/ecs-engine";
import { DateAddedFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { useMockupData } from "../../../hooks/useMockupData";
import { dummyPodcasts } from "../../../base/dummy";

const fetchPodcasts = async () => {
  const { data: podcasts, error } = await supabaseClient.from("podcasts").select("title, createdAt, id").limit(10);

  if (error) {
    console.error("Error fetching podcasts", error);
  }

  return podcasts || [];
};

const LoadPodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isPodcastCollectionVisible = useIsStoryCurrent(Stories.OBSERVING_PODCASTS_COLLECTION);
  const { mockupData } = useMockupData();

  useEffect(() => {
    const initializePodcastEntities = async () => {
      const podcasts = mockupData ? dummyPodcasts :  await fetchPodcasts();

      podcasts.forEach((podcast) => {
        const newPodcastEntity = new Entity();
        lsc.engine.addEntity(newPodcastEntity);
        newPodcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
        newPodcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
        newPodcastEntity.add(new TitleFacet({ title: podcast.title }));
        newPodcastEntity.addTag(DataTypes.PODCAST);
      });
    };

    if (isPodcastCollectionVisible) {
      initializePodcastEntities();
    }
  }, [isPodcastCollectionVisible]);

  return null;
};

export default LoadPodcastsSystem;

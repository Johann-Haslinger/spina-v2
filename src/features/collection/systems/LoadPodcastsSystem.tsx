import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext, useEffect } from "react";
import supabaseClient from "../../../lib/supabase";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories } from "../../../base/enums";
import { Entity } from "@leanscope/ecs-engine";
import { DateAddedFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useMockupData } from "../../../hooks/useMockupData";
import { dummyPodcasts } from "../../../base/dummy";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchPodcasts = async () => {
  const { data: podcasts, error } = await supabaseClient.from("podcasts").select("title, createdAt, id").limit(10);

  if (error) {
    console.error("Error fetching podcasts", error);
  }

  return podcasts || [];
};

const fetchPodcastsForTopic = async (parentId: string) => {
  const { data: podcasts, error } = await supabaseClient
    .from("podcasts")
    .select("title, createdAt, id")
    .eq("parentId", parentId);

  if (error) {
    console.error("Error fetching podcasts", error);
  }

  return podcasts || [];
};

const LoadPodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isPodcastCollectionVisible = useIsStoryCurrent(Stories.OBSERVING_PODCASTS_COLLECTION);
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializePodcastEntities = async () => {
      if (isPodcastCollectionVisible || selectedTopicId) {
        const podcasts = mockupData
          ? dummyPodcasts.slice(0, 6)
          : shouldFetchFromSupabase
          ? selectedTopicId
            ? await fetchPodcastsForTopic(selectedTopicId)
            : await fetchPodcasts()
          : [];

        podcasts.forEach((podcast) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST)
          );

          if (!isExisting) {
            const newPodcastEntity = new Entity();
            lsc.engine.addEntity(newPodcastEntity);
            newPodcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            newPodcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
            newPodcastEntity.add(new TitleFacet({ title: podcast.title }));
            newPodcastEntity.addTag(DataTypes.PODCAST);

            if (selectedTopicId) {
              newPodcastEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            }
          }
        });
      }
    };

    initializePodcastEntities();
  }, [isPodcastCollectionVisible, mockupData, selectedTopicId, shouldFetchFromSupabase]);

  return null;
};

export default LoadPodcastsSystem;

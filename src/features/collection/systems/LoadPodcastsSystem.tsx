import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/additionalFacets";
import { dummyPodcasts } from "../../../base/dummy";
import { DataTypes, Stories, SupabaseColumns, SupabaseTables } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchPodcasts = async () => {
  const { data: podcasts, error } = await supabaseClient
    .from(SupabaseTables.PODCASTS)
    .select("title, date_added, id")
    .limit(10);

  if (error) {
    console.error("Error fetching podcasts", error);
  }

  return podcasts || [];
};

const fetchPodcastsForTopic = async (parentId: string) => {
  const { data: podcasts, error } = await supabaseClient
    .from(SupabaseTables.PODCASTS)
    .select("title, date_added, id")
    .eq(SupabaseColumns.PARENT_ID, parentId);

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
            newPodcastEntity.add(new DateAddedFacet({ dateAdded: podcast.date_added }));
            newPodcastEntity.add(new TitleFacet({ title: podcast.title || "" }));
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

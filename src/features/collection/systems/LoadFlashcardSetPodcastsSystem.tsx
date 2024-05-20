import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet, DateAddedFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedFlashcardSet } from "../hooks/useSelectedFlashcardSet";
import { dummyPodcasts } from "../../../base/dummy";

const fetchPodcastForFlashcardSet = async (flashcardSetId: string) => {
  const { data: podcasts, error } = await supabaseClient
    .from("podcasts")
    .select("title, id, createdAt")
    .eq("parentId", flashcardSetId);

  if (error) {
    console.error("Error fetching FlashcardSet podcasts:", error);
    return;
  }

  return podcasts;
};

const LoadFlashcardSetPodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedFlashcardSetId } = useSelectedFlashcardSet();
  const { mockupData, shouldFetchFromSupabase } = useMockupData();

  useEffect(() => {
    const initializeFlashcardSetPodcast = async () => {
      if (selectedFlashcardSetId) {
        const podcasts = mockupData ? dummyPodcasts.slice(0, 1) : shouldFetchFromSupabase ? await fetchPodcastForFlashcardSet(selectedFlashcardSetId) : [];
        
        podcasts?.forEach((podcast) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST)
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedFlashcardSetId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || "" }));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
            podcastEntity.addTag(DataTypes.PODCAST);
          }
        });
      }
    };

    initializeFlashcardSetPodcast();
  }, [selectedFlashcardSetId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadFlashcardSetPodcastsSystem;

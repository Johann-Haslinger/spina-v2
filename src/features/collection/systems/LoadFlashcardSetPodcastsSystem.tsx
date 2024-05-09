import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet, DateAddedFacet } from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedFlashcardSet } from "../hooks/useSelectedFlashcardSet";

const LoadFlashcardSetPodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedFlashcardSetId } = useSelectedFlashcardSet();
  const { mockupData } = useMockupData();

  useEffect(() => {
    const initializeFlashcardSetPodcast = async () => {
      if (selectedFlashcardSetId) {
        const { data: podcast, error } = await supabaseClient
          .from("podcasts")
          .select("title, id, createdAt")
          .eq("parentId", selectedFlashcardSetId)
          .single();

        if (error) {
          console.error("Error fetching FlashcardSet podcast:", error);
          return;
        }

        if (podcast) {
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
        }
      }
    };

    initializeFlashcardSetPodcast();
  }, [selectedFlashcardSetId, mockupData]);

  return null;
};

export default LoadFlashcardSetPodcastsSystem;

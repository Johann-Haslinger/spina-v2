import { useContext, useEffect } from "react";
import { useSelectedNote } from "../hooks/useSelectedNote";
import { useMockupData } from "../../../hooks/useMockupData";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet, DateAddedFacet } from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import { dummyPodcasts } from "../../../base/dummy";

const fetchPodcastsForNote = async (noteId: string) => {
  const { data: podcasts, error } = await supabaseClient
    .from("podcasts")
    .select("title, id, createdAt")
    .eq("parentId", noteId);

  if (error) {
    console.error("Error fetching note podcasts:", error);
    return;
  }

  return podcasts;
};

const LoadNotePodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedNoteId } = useSelectedNote();
  const { mockupData, shouldFetchFromSupabase } = useMockupData();

  useEffect(() => {
    const initializeNotePodcast = async () => {
      if (selectedNoteId) {
        const podcasts = mockupData
          ? dummyPodcasts.slice(0, 1)
          : shouldFetchFromSupabase
          ? await fetchPodcastsForNote(selectedNoteId)
          : [];

        podcasts?.forEach((podcast) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST)
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedNoteId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || "" }));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
            podcastEntity.addTag(DataTypes.PODCAST);
          }
        });
      }
    };

    initializeNotePodcast();
  }, [selectedNoteId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadNotePodcastsSystem;

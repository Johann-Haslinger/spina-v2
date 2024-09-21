import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyPodcasts } from '../../../base/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedNote } from '../hooks/useSelectedNote';

const fetchPodcastsForNote = async (noteId: string) => {
  const { data: podcasts, error } = await supabaseClient
    .from(SupabaseTable.PODCASTS)
    .select('title, id, date_added')
    .eq(SupabaseColumn.PARENT_ID, noteId);

  if (error) {
    console.error('Error fetching note podcasts:', error);
    return;
  }

  return podcasts;
};

const LoadNotePodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedNoteId } = useSelectedNote();
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();

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
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataType.PODCAST),
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedNoteId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || '' }));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.date_added }));
            podcastEntity.addTag(DataType.PODCAST);
          }
        });
      }
    };

    initializeNotePodcast();
  }, [selectedNoteId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadNotePodcastsSystem;

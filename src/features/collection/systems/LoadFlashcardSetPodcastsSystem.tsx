import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { DateAddedFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { dummyPodcasts } from '../../../common/types/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';
import { useSelectedFlashcardSet } from '../hooks/useSelectedFlashcardSet';

const fetchPodcastForFlashcardSet = async (flashcardSetId: string) => {
  const { data: podcasts, error } = await supabaseClient
    .from(SupabaseTable.PODCASTS)
    .select('title, id, date_added')
    .eq(SupabaseColumn.PARENT_ID, flashcardSetId);

  if (error) {
    console.error('Error fetching FlashcardSet podcasts:', error);
    return;
  }

  return podcasts;
};

const LoadFlashcardSetPodcastsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedFlashcardSetId } = useSelectedFlashcardSet();
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();

  useEffect(() => {
    const initializeFlashcardSetPodcast = async () => {
      if (selectedFlashcardSetId) {
        const podcasts = mockupData
          ? dummyPodcasts.slice(0, 1)
          : shouldFetchFromSupabase
            ? await fetchPodcastForFlashcardSet(selectedFlashcardSetId)
            : [];

        podcasts?.forEach((podcast) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataType.PODCAST),
          );

          if (!isExisting) {
            const podcastEntity = new Entity();
            lsc.engine.addEntity(podcastEntity);
            podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
            podcastEntity.add(new ParentFacet({ parentId: selectedFlashcardSetId }));
            podcastEntity.add(new TitleFacet({ title: podcast.title || '' }));
            podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.date_added }));
            podcastEntity.addTag(DataType.PODCAST);
          }
        });
      }
    };

    initializeFlashcardSetPodcast();
  }, [selectedFlashcardSetId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadFlashcardSetPodcastsSystem;

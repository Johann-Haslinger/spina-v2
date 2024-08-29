import { useEffect } from 'react';
import { SourceFacet } from '../../../app/additionalFacets';
import { dummyBase64Audio } from '../../../base/dummyBase64Audio';
import { SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedPodcast } from '../hooks/useSelectedPodcast';

const base64toBlob = (base64Data: string, contentType: string) => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

const fetchPodcastAudio = async (podcastId: string) => {
  const { data: audioData, error } = await supabaseClient
    .from(SupabaseTable.PODCASTS)
    .select('audio')
    .eq(SupabaseColumn.ID, podcastId)
    .single();

  if (error) {
    console.error('Error fetching podcast audio', error);
  }

  return audioData;
};

const LoadPodcastAudioSystem = () => {
  const { selectedPodcastEntity, selectedPodcastId, selectedPodcastSource } = useSelectedPodcast();
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();

  useEffect(() => {
    const loadPodcastAudio = async () => {
      if (selectedPodcastId && !selectedPodcastSource) {
        const audioData = mockupData
          ? { audio: dummyBase64Audio }
          : shouldFetchFromSupabase
            ? await fetchPodcastAudio(selectedPodcastId || '')
            : null;

        const audioBlob = audioData && base64toBlob(audioData?.audio, 'audio/mpeg');
        const audioUrl = audioBlob && URL.createObjectURL(audioBlob);

        selectedPodcastEntity?.add(new SourceFacet({ source: audioUrl || '' }));
      }
    };

    loadPodcastAudio();
  }, [selectedPodcastId, shouldFetchFromSupabase]);

  return null;
};

export default LoadPodcastAudioSystem;

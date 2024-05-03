import { useEffect } from "react";
import { useSelectedPodcast } from "../hooks/useSelectedPodcast";
import supabaseClient from "../../../lib/supabase";
import { SourceFacet } from "../../../app/AdditionalFacets";
import { useMockupData } from "../../../hooks/useMockupData";
import { dummyAudio } from "../../../base/dummy";

const base64toBlob = (base64Data: string, contentType: string) => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

const LoadPodcastAudioSystem = () => {
  const { selectedPodcastEntity, selectedPodcastId } = useSelectedPodcast();
  const { mockupData } = useMockupData();

  useEffect(() => {
    const fetchPodcastAudio = async () => {
      const { data: audioData, error } = await supabaseClient
        .from("podcasts")
        .select("base64Audio")
        .eq("id", selectedPodcastId)
        .single();

      if (error) {
        console.error("Error fetching podcast audio", error);
      }

      const audioBlob = audioData && base64toBlob(audioData?.base64Audio, "audio/mpeg");
      const audioUrl = mockupData ? dummyAudio : audioBlob && URL.createObjectURL(audioBlob);

      selectedPodcastEntity?.add(new SourceFacet({ source: audioUrl || "" }));

      console.log("fetchPodcastAudio", selectedPodcastEntity, audioUrl);
    };

    if (selectedPodcastId) {
      fetchPodcastAudio();
    }
  }, [selectedPodcastId]);

  return null;
};

export default LoadPodcastAudioSystem;

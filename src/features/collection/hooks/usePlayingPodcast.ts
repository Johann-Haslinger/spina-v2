import { useEntity } from "@leanscope/ecs-engine";
import { AdditionalTags, DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { TitleFacet, SourceFacet } from "../../../app/AdditionalFacets";

export const usePlayingPodcast = () => {
  const [playingPodcastEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.PODCAST) && (e.has(AdditionalTags.PLAYING) || e.has(AdditionalTags.PAUSED))
  );
  const playingPodcastId = playingPodcastEntity?.get(IdentifierFacet)?.props.guid;
  const playingPodcastTitle = playingPodcastEntity?.get(TitleFacet)?.props.title;
  const playingPodcastSource = playingPodcastEntity?.get(SourceFacet)?.props.source;
  const [isPlaying] = useEntityHasTags(playingPodcastEntity, AdditionalTags.PLAYING);

  const setIsPlaying = (value: boolean) => {
    if (value) {
      playingPodcastEntity?.addTag(AdditionalTags.PLAYING);
    } else {
      playingPodcastEntity?.removeTag(AdditionalTags.PLAYING);
    }
  };

  const setIsPaused = (value: boolean) => {

    if (value) {
      playingPodcastEntity?.addTag(AdditionalTags.PAUSED);
      playingPodcastEntity?.removeTag(AdditionalTags.PLAYING);
    } else {
      playingPodcastEntity?.removeTag(AdditionalTags.PAUSED);
      playingPodcastEntity?.addTag(AdditionalTags.PLAYING);
    }
  };

  return {
    playingPodcastEntity,
    playingPodcastId,
    playingPodcastTitle,
    playingPodcastSource,
    isPlaying,
    setIsPlaying,
    setIsPaused,
  };
};

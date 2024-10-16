import { useEntity, useEntityHasTags } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { SourceFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { AdditionalTag, DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const usePlayingPodcast = () => {
  const [playingPodcastEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.PODCAST) && (e.has(AdditionalTag.PLAYING) || e.has(AdditionalTag.PAUSED)),
  );
  const playingPodcastId = playingPodcastEntity?.get(IdentifierFacet)?.props.guid;
  const playingPodcastTitle = playingPodcastEntity?.get(TitleFacet)?.props.title;
  const playingPodcastSource = playingPodcastEntity?.get(SourceFacet)?.props.source;
  const [isPlaying] = useEntityHasTags(playingPodcastEntity, AdditionalTag.PLAYING);

  const setIsPlaying = (value: boolean) => {
    if (value) {
      playingPodcastEntity?.addTag(AdditionalTag.PLAYING);
    } else {
      playingPodcastEntity?.removeTag(AdditionalTag.PLAYING);
    }
  };

  const setIsPaused = (value: boolean) => {
    if (value) {
      playingPodcastEntity?.addTag(AdditionalTag.PAUSED);
      playingPodcastEntity?.removeTag(AdditionalTag.PLAYING);
    } else {
      playingPodcastEntity?.removeTag(AdditionalTag.PAUSED);
      playingPodcastEntity?.addTag(AdditionalTag.PLAYING);
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

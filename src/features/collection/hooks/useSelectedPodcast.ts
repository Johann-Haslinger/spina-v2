import { useEntity, useEntityHasTags } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { SourceFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { AdditionalTag, DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedPodcast = () => {
  const [selectedPodcastEntity] = useEntity((e) => dataTypeQuery(e, DataType.PODCAST) && e.has(Tags.SELECTED));
  const selectedPodcastId = selectedPodcastEntity?.get(IdentifierFacet)?.props.guid;
  const selectedPodcastTitle = selectedPodcastEntity?.get(TitleFacet)?.props.title;
  const selectedPodcastSource = selectedPodcastEntity?.get(SourceFacet)?.props.source;
  const [isPlaying] = useEntityHasTags(selectedPodcastEntity, AdditionalTag.PLAYING);

  const setIsPlaying = (value: boolean) => {
    if (value) {
      selectedPodcastEntity?.addTag(AdditionalTag.PLAYING);
    } else {
      selectedPodcastEntity?.removeTag(AdditionalTag.PLAYING);
    }
  };

  return {
    selectedPodcastEntity,
    selectedPodcastId,
    selectedPodcastTitle,
    selectedPodcastSource,
    isPlaying,
    setIsPlaying,
  };
};

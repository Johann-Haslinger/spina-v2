import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { AdditionalTags, DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { SourceFacet, TitleFacet } from "../../../app/additionalFacets";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";

export const useSelectedPodcast = () => {
  const [selectedPodcastEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.PODCAST) && e.has(Tags.SELECTED));
  const selectedPodcastId = selectedPodcastEntity?.get(IdentifierFacet)?.props.guid;
  const selectedPodcastTitle = selectedPodcastEntity?.get(TitleFacet)?.props.title;
  const selectedPodcastSource = selectedPodcastEntity?.get(SourceFacet)?.props.source;
  const [isPlaying] = useEntityHasTags(selectedPodcastEntity, AdditionalTags.PLAYING);

  const setIsPlaying = (value: boolean) => {
    if (value) {
      selectedPodcastEntity?.addTag(AdditionalTags.PLAYING);
    } else {
      selectedPodcastEntity?.removeTag(AdditionalTags.PLAYING);
    }
  };

  return { selectedPodcastEntity, selectedPodcastId, selectedPodcastTitle, selectedPodcastSource, isPlaying, setIsPlaying };
};

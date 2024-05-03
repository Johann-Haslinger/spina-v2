import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { SourceFacet, TitleFacet } from "../../../app/AdditionalFacets";

export const useSelectedPodcast = () => {
  const [selectedPodcastEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.PODCAST) && e.has(Tags.SELECTED));
  const selectedPodcastId = selectedPodcastEntity?.get(IdentifierFacet)?.props.guid;
  const selectedPodcastTitle = selectedPodcastEntity?.get(TitleFacet)?.props.title;
  const selectedPodcastSource = selectedPodcastEntity?.get(SourceFacet)?.props.source;

  return { selectedPodcastEntity, selectedPodcastId, selectedPodcastTitle, selectedPodcastSource };
};

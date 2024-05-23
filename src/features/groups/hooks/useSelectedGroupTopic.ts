import { useEntity } from "@leanscope/ecs-engine";
import { Tags, IdentifierFacet, DescriptionFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedGroupTopic = () => {
  const [selectedGroupTopicEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.GROUP_TOPIC) && e.hasTag(Tags.SELECTED));
  const selectedGroupTopicId = selectedGroupTopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupTopicTitle = selectedGroupTopicEntity?.get(TitleFacet)?.props.title;
  const selectedGroupTopicDescription = selectedGroupTopicEntity?.get(DescriptionFacet)?.props.description;

  return {
    selectedGroupTopicEntity,
    selectedGroupTopicTitle,
    selectedGroupTopicId,
    selectedGroupTopicDescription,
  };
};

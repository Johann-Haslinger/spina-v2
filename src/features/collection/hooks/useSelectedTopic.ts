import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";

export const useSelectedTopic = () => {
  const [selectedTopicEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.TOPIC) && e.hasTag(Tags.SELECTED)
  );
  const selectedTopicId = selectedTopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedTopicTitle = selectedTopicEntity?.get(TitleFacet)?.props.title;

  return { selectedTopicEntity, selectedTopicTitle, selectedTopicId };
};

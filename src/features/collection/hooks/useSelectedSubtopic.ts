import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";

export const useSelectedSubtopic = () => {
  const [selectedSubtopicEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.SUBTOPIC) && e.hasTag(Tags.SELECTED)
  );
  const selectedSubtopicTitle = selectedSubtopicEntity?.get(TitleFacet)?.props.title;
  const selectedSubtopicId = selectedSubtopicEntity?.get(IdentifierFacet)?.props.guid;

  return {
    selectedSubtopicEntity,
    selectedSubtopicTitle,
    selectedSubtopicId,
  };
};

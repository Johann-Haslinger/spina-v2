import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/additionalFacets";

export const useSelectedSubtopic = () => {
  const [selectedSubtopicEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.SUBTOPIC) && e.hasTag(Tags.SELECTED)
  );
  const selectedSubtopicTitle = selectedSubtopicEntity?.get(TitleFacet)?.props.title;
  const selectedSubtopicId = selectedSubtopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedSubtopicText = selectedSubtopicEntity?.get(TextFacet)?.props.text;

  return {
    selectedSubtopicEntity,
    selectedSubtopicTitle,
    selectedSubtopicId,
    selectedSubtopicText,
  };
};

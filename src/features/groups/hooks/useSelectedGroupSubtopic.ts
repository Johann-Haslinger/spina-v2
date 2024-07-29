import { useEntity } from "@leanscope/ecs-engine";
import { Tags, IdentifierFacet, TextFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedGroupSubtopic = () => {
  const [selectedGroupSubtopicEntity] = useEntity(
    (e) =>
      dataTypeQuery(e, DataTypes.GROUP_SUBTOPIC) && e.hasTag(Tags.SELECTED),
  );
  const selectedGroupSubtopicTitle =
    selectedGroupSubtopicEntity?.get(TitleFacet)?.props.title;
  const selectedGroupSubtopicId =
    selectedGroupSubtopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupSubtopicText =
    selectedGroupSubtopicEntity?.get(TextFacet)?.props.text;

  return {
    selectedGroupSubtopicEntity,
    selectedGroupSubtopicTitle,
    selectedGroupSubtopicId,
    selectedGroupSubtopicText,
  };
};

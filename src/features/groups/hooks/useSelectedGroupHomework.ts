import { useEntity } from "@leanscope/ecs-engine";
import { Tags, IdentifierFacet, TextFacet } from "@leanscope/ecs-models";
import { TitleFacet, DueDateFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedGroupHomework = () => {
  const [selectedGroupHomeworkEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.GROUP_HOMEWORK) && e.hasTag(Tags.SELECTED));

  const selectedGroupHomeworkTitle = selectedGroupHomeworkEntity?.get(TitleFacet)?.props.title;
  const selectedGroupHomeworkId = selectedGroupHomeworkEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupHomeworkDueDate = selectedGroupHomeworkEntity?.get(DueDateFacet)?.props.dueDate;
  const selectedGroupHomeworkText = selectedGroupHomeworkEntity?.get(TextFacet)?.props.text;

  return {
    selectedGroupHomeworkEntity,
    selectedGroupHomeworkTitle,
    selectedGroupHomeworkId,
    selectedGroupHomeworkDueDate,
    selectedGroupHomeworkText,
  };
};

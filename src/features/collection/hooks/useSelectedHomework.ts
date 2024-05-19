import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../../../app/additionalFacets";

export const useSelectedHomework = () => {
  const [selectedHomeworkEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.hasTag(Tags.SELECTED));

  const selectedHomeworkTitle = selectedHomeworkEntity?.get(TitleFacet)?.props.title;
  const selectedHomeworkId = selectedHomeworkEntity?.get(IdentifierFacet)?.props.guid;
  const selectedHomeworkDueDate = selectedHomeworkEntity?.get(DueDateFacet)?.props.dueDate;
  const selectedHomeworkText = selectedHomeworkEntity?.get(TextFacet)?.props.text;

  return {
    selectedHomeworkEntity,
    selectedHomeworkTitle,
    selectedHomeworkId,
    selectedHomeworkDueDate,
    selectedHomeworkText,
  };
};

import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../../../app/AdditionalFacets";

export const useSelectedHomework = () => {
  const [selectedHomeworkEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.hasTag(Tags.SELECTED)
  );
  const selectedHomeworkTitle =
    selectedHomeworkEntity?.get(TitleFacet)?.props.title;
  const selectedHomeworkId =
    selectedHomeworkEntity?.get(IdentifierFacet)?.props.guid;
  const selectedHomeworkDueDate =
    selectedHomeworkEntity?.get(DueDateFacet)?.props.dueDate;

    console.log("selectedHomeworkEntity",selectedHomeworkTitle, selectedHomeworkDueDate);
  return {
    selectedHomeworkEntity,
    selectedHomeworkTitle,
    selectedHomeworkId,
    selectedHomeworkDueDate,
  };
};

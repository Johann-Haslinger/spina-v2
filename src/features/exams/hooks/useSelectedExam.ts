import { useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";
import { TitleFacet, DueDateFacet } from "../../../app/a";

export const useSelectedExam = () => {
  const [selectedExamEntity] = useEntity((e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataTypes.EXAM));

  const selectedExamId = selectedExamEntity?.get(IdentifierFacet)?.props.guid;
  const selectedExamTitle = selectedExamEntity?.get(TitleFacet)?.props.title;
  const selectedExamDueDate = selectedExamEntity?.get(DueDateFacet)?.props.dueDate;

  return { selectedExamEntity, selectedExamId, selectedExamTitle, selectedExamDueDate};
};

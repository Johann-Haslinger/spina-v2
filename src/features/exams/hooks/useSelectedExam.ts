import { useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedExam = () => {
  const [selectedExamEntity] = useEntity((e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataTypes.EXAM));

  const selectedExamId = selectedExamEntity?.get(IdentifierFacet)?.props.guid;

  return { selectedExamEntity, selectedExamId };
};

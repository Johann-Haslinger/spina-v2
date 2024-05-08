import { useEntities } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";

export const useExams = () => {
  const [examEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.EXAM));
  const existExams = examEntities.length > 0;

  return { examEntities, existExams };
};

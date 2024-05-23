import { useEntities } from "@leanscope/ecs-engine";
import { DataTypes } from "../../../base/enums";

export const useLearningGroups = () => {
  const [learningGroupEntities] = useEntities((e) => e.has(DataTypes.LEARNING_GROUP));

  const existLearningGroups = learningGroupEntities.length > 0;

  return {
    learningGroupEntities,
    existLearningGroups,
  };
};

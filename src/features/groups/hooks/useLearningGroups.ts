import { useEntities } from '@leanscope/ecs-engine';
import { DataType } from '../../../base/enums';

export const useLearningGroups = () => {
  const [learningGroupEntities] = useEntities((e) => e.has(DataType.LEARNING_GROUP));

  const existLearningGroups = learningGroupEntities.length > 0;

  return {
    learningGroupEntities,
    existLearningGroups,
  };
};

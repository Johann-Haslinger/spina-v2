import { useEntities } from '@leanscope/ecs-engine';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useExams = () => {
  const [examEntities] = useEntities((e) => dataTypeQuery(e, DataType.EXAM));
  const existExams = examEntities.length > 0;

  return { examEntities, existExams };
};

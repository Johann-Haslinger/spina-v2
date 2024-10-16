import { useEntities } from '@leanscope/ecs-engine';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useExams = () => {
  const [examEntities] = useEntities((e) => dataTypeQuery(e, DataType.EXAM));
  const existExams = examEntities.length > 0;

  return { examEntities, existExams };
};

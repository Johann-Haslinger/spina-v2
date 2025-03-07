import { useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useMemo } from 'react';
import { TitleFacet, WeightFacet } from '../types/additionalFacets';
import { DataType } from '../types/enums';
import { dataTypeQuery } from '../utilities/queries';

export const useGradeTypes = () => {
  const [gradeEntities] = useEntities((e) => dataTypeQuery(e, DataType.GRADE_TYPE));
  const gradeTypes = useMemo(() => {
    return gradeEntities.map((gradeEntity) => {
      const id = gradeEntity.get(IdentifierFacet)?.props.guid;
      const title = gradeEntity.get(TitleFacet)?.props.title;
      const weight = gradeEntity.get(WeightFacet)?.props.weight;

      return { id, title, weight };
    });
  }, [JSON.stringify(gradeEntities)]);

  return gradeTypes;
};

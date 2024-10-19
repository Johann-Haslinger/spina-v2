import { Entity, useEntities } from '@leanscope/ecs-engine';
import { ParentFacet } from '@leanscope/ecs-models';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery, isChildOfQuery } from '../../../common/utilities/queries';

export const useExerciseParts = (exerciseEntity?: Entity, exercisePartEntity?: Entity) => {
  const [exercisePartEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataType.EXERCISE_PART) &&
      (isChildOfQuery(e, exerciseEntity) ||
        exercisePartEntity?.get(ParentFacet)?.props.parentId == e.get(ParentFacet)?.props.parentId),
  );

  const hasExerciseParts = exercisePartEntities.length > 0;
  const exercisePartsCount = exercisePartEntities.length;

  return {
    hasExerciseParts,
    exercisePartEntities,
    exercisePartsCount,
  };
};

import { Entity, useEntities } from '@leanscope/ecs-engine';
import { DataTypes } from '../../../base/enums';
import { dataTypeQuery, isChildOfQuery } from '../../../utils/queries';
import { ParentFacet } from '@leanscope/ecs-models';

export const useExerciseParts = (exerciseEntity?: Entity, exercisePartEntity?: Entity) => {
  const [exercisePartEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataTypes.EXERCISE_PART) &&
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

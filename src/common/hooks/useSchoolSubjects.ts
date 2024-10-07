import { Entity, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../base/additionalFacets';
import { DataType } from '../../base/enums';

export const useSchoolSubjectEntities = (): readonly Entity[] => {
  const [schoolSubjectEntities] = useEntities(
    (e) => e.has(TitleFacet) && e.has(IdentifierFacet) && e.hasTag(DataType.SCHOOL_SUBJECT),
  );
  return schoolSubjectEntities;
};

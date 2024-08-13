import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../app/additionalFacets';
import { DataTypes } from '../base/enums';
import { dataTypeQuery } from '../utils/queries';

export const useSchoolSubject = (schoolSubjectId?: string) => {
  const [schoolSubjectEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) && e.get(IdentifierFacet)?.props.guid === schoolSubjectId,
  );
  const schoolSubjectTitle = schoolSubjectEntity?.get(TitleFacet)?.props.title || 'No Title';

  return {
    schoolSubjectEntity,
    schoolSubjectTitle,
  };
};

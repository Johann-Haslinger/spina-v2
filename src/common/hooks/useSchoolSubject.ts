import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../common/types/additionalFacets';
import { DataType } from '../types/enums';
import { dataTypeQuery } from '../utilities/queries';

export const useSchoolSubject = (schoolSubjectId?: string) => {
  const [schoolSubjectEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT) && e.get(IdentifierFacet)?.props.guid === schoolSubjectId,
  );
  const schoolSubjectTitle = schoolSubjectEntity?.get(TitleFacet)?.props.title || 'No Title';

  return {
    schoolSubjectEntity,
    schoolSubjectTitle,
  };
};

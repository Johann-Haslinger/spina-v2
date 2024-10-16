import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';

export const useSelectedGroupSchoolSubject = () => {
  const [selectedGroupSchoolSubjectEntity] = useEntity(
    (e) => e.has(DataType.GROUP_SCHOOL_SUBJECT) && e.has(Tags.SELECTED),
  );

  const selectedGroupSchoolSubjectId = selectedGroupSchoolSubjectEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupSchoolSubjectTitle = selectedGroupSchoolSubjectEntity?.get(TitleFacet)?.props.title;

  return {
    selectedGroupSchoolSubjectEntity,
    selectedGroupSchoolSubjectTitle,
    selectedGroupSchoolSubjectId,
  };
};

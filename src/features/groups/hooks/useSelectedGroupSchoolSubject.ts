import { useEntity } from '@leanscope/ecs-engine';
import { DataTypes } from '../../../base/enums';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../app/additionalFacets';

export const useSelectedGroupSchoolSubject = () => {
  const [selectedGroupSchoolSubjectEntity] = useEntity(
    (e) => e.has(DataTypes.GROUP_SCHOOL_SUBJECT) && e.has(Tags.SELECTED),
  );

  const selectedGroupSchoolSubjectId = selectedGroupSchoolSubjectEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupSchoolSubjectTitle = selectedGroupSchoolSubjectEntity?.get(TitleFacet)?.props.title;

  return {
    selectedGroupSchoolSubjectEntity,
    selectedGroupSchoolSubjectTitle,
    selectedGroupSchoolSubjectId,
  };
};

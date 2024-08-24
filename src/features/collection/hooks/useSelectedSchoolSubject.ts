import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../app/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useSelectedSchoolSubject = () => {
  const [selectedSchoolSubjectEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED),
  );
  const selectedSchoolSubjectId = selectedSchoolSubjectEntity?.get(IdentifierFacet)?.props.guid;
  const selectedSchoolSubjectTitle = selectedSchoolSubjectEntity?.get(TitleFacet)?.props.title;
  const selectedSchoolSubjectOrder = selectedSchoolSubjectEntity?.get(OrderFacet)?.props.orderIndex;

  return {
    selectedSchoolSubjectEntity,
    selectedSchoolSubjectTitle,
    selectedSchoolSubjectId,
    selectedSchoolSubjectOrder,
  };
};

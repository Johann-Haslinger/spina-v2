import { useEntities } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataType } from '../../../base/enums';
import { useSchoolSubjectColors } from '../../../hooks/useSchoolSubjectColors';
import { dataTypeQuery } from '../../../utils/queries';

export const useSelectedSchoolSubjectColor = () => {
  const [selectedSchoolSubjectEntity] = useEntities(
    (e) =>
      e.has(Tags.SELECTED) &&
      (dataTypeQuery(e, DataType.SCHOOL_SUBJECT) || dataTypeQuery(e, DataType.GROUP_SCHOOL_SUBJECT)),
  )[0];
  const { color, backgroundColor } = useSchoolSubjectColors(selectedSchoolSubjectEntity);

  if (selectedSchoolSubjectEntity) {
    return { backgroundColor, color };
  } else {
    return COLOR_ITEMS[1];
  }
};

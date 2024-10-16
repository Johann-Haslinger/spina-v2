import { useEntities } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useSchoolSubjectColors } from '../../../common/hooks/useSchoolSubjectColors';
import { COLOR_ITEMS } from '../../../common/types/constants';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedSchoolSubjectColor = () => {
  const [selectedSchoolSubjectEntity] = useEntities(
    (e) =>
      e.has(Tags.SELECTED) &&
      (dataTypeQuery(e, DataType.SCHOOL_SUBJECT) || dataTypeQuery(e, DataType.GROUP_SCHOOL_SUBJECT)),
  )[0];
  const { color, backgroundColor, backgroundColorDark } = useSchoolSubjectColors(selectedSchoolSubjectEntity);

  if (selectedSchoolSubjectEntity) {
    return { backgroundColor, color, backgroundColorDark };
  } else {
    return COLOR_ITEMS[1];
  }
};

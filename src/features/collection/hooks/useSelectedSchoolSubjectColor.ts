import { useEntities } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { COLOR_ITEMS } from "../../../base/constants";
import { DataTypes } from "../../../base/enums";
import { useSchoolSubjectColors } from "../../../hooks/useSchoolSubjectColors";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedSchoolSubjectColor = () => {
  const [selectedSchoolSubjectEntity] = useEntities(
    (e) =>
      e.has(Tags.SELECTED) &&
      (dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) || dataTypeQuery(e, DataTypes.GROUP_SCHOOL_SUBJECT))
  )[0];
  if (selectedSchoolSubjectEntity) {
    const { accentColor, color, backgroundColor } = useSchoolSubjectColors(selectedSchoolSubjectEntity);

    return { backgroundColor, color, accentColor };
  } else {
    return COLOR_ITEMS[1];
  }
};

import { useEntity } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { DataTypes } from "../../../base/enums";
import { useSchoolSubjectColors } from "../../../hooks/useSchoolSubjectColors";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedSchoolSubjectColor = () => {
  const [selectedSchoolSubjectEntity] = useEntity(
    (e) =>
      e.has(Tags.SELECTED) &&
      (dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) || dataTypeQuery(e, DataTypes.GROUP_SCHOOL_SUBJECT))
  );
  if (selectedSchoolSubjectEntity) {
    const { accentColor, color, backgroundColor } = useSchoolSubjectColors(selectedSchoolSubjectEntity);

    return { backgroundColor, color, accentColor };
  } else {
    return { backgroundColor: "blue", color: "white", accentColor: "white" };
  }
};

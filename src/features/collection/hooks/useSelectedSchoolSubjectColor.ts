import { useEntity } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { useSchoolSubjectColors } from "../../../hooks/useSchoolSubjectColors";

export const useSelectedSchoolSubjectColor = () => {
  const [selectedSchoolSubjectEntity] = useEntity(
    (e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)
  );
  if (selectedSchoolSubjectEntity) {
    const { backgroundColor, color } = useSchoolSubjectColors(
      selectedSchoolSubjectEntity
    );

    return { backgroundColor, color };
  }else {
    return { backgroundColor: "#00965F", color: "white" };
  }
};

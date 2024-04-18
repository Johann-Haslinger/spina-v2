import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";

export const useSelectedSchoolSubject = () => {
  const [selectedSchoolSubjectEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED)
  );
  const selectedSchoolSubjectId = selectedSchoolSubjectEntity?.get(IdentifierFacet)?.props.guid

  return { selectedSchoolSubjectEntity, selectedSchoolSubjectId };
};

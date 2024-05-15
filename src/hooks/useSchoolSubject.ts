import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { DataTypes } from "../base/enums";
import { TitleFacet } from "../app/a";

export const useSchoolSubject = (schoolSubjectId?: string) => {
  const [schoolSubjectEntity] = useEntity(
    (e) =>
      dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) &&
      e.get(IdentifierFacet)?.props.guid === schoolSubjectId
  );
  const schoolSubjectTitle =
    schoolSubjectEntity?.get(TitleFacet)?.props.title || "No Title";

  return {
    schoolSubjectEntity,
    schoolSubjectTitle,
  };
};

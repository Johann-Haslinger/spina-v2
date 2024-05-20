import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/additionalFacets";
import { DataTypes } from "../base/enums";

export const useSchoolSubjectEntities = (): readonly Entity[] => {
  const [schoolSubjectEntities] = useEntities(
    (e) => e.has(TitleFacet) && e.has(IdentifierFacet) && e.hasTag(DataTypes.SCHOOL_SUBJECT)
  );
  return schoolSubjectEntities;
};

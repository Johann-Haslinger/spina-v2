import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import React from "react";
import { TitleFacet } from "../app/AdditionalFacets";
import { DataTypes } from "../base/enums";

const useSchoolSubjectEntities = (): readonly Entity[] => {
  const [schoolSubjectEntities] = useEntities(
    (e) =>
      e.has(TitleFacet) &&
      e.has(IdentifierFacet) &&
      e.hasTag(DataTypes.SCHOOL_SUBJECT)
  );
  return schoolSubjectEntities
};

export default useSchoolSubjectEntities;

import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery, isChildOfQuery } from "../../../utils/queries";

export const useSchoolSubjectTopicEntities = (schoolSubjectEntity: Entity) => {
  const [topics] = useEntities(
    (e) =>
      dataTypeQuery(e, DataTypes.TOPIC) &&
      isChildOfQuery(e, schoolSubjectEntity)
  );
  return { schoolSubjectTopics: topics, hasTopics: topics.length > 0 };
};

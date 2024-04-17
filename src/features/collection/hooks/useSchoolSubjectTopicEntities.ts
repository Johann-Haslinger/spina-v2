import { Entity, useEntities } from "@leanscope/ecs-engine";
import { ParentFacet } from "@leanscope/ecs-models";
import { DataTypes } from "../../../base/enums";

export const useSchoolSubjectTopicEntities = (schoolSubjectEntity: Entity) => {
  const schoolSubjectId = schoolSubjectEntity.get(ParentFacet)?.props.parentId;
  const [topics] = useEntities(
    (e) =>
      e.hasTag(DataTypes.TOPIC) &&
      e.get(ParentFacet)?.props.parentId === schoolSubjectId
  );
  return { schoolSubjectTopics: topics, hasTopics: topics.length > 0 };
};


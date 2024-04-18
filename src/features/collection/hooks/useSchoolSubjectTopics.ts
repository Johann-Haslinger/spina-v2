import { Entity, useEntities } from "@leanscope/ecs-engine";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery, isChildOfQuery } from "../../../utils/queries";

export const useSchoolSubjectTopics = (schoolSubjectEntity?: Entity) => {
  const [topics] =  useEntities(
        (e) =>
          dataTypeQuery(e, DataTypes.TOPIC) &&
          isChildOfQuery(e, schoolSubjectEntity || new Entity())
      )

  return { schoolSubjectTopics: topics, hasTopics: topics.length > 0 };
};

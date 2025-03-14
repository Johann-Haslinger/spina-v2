import { Entity, useEntities } from '@leanscope/ecs-engine';
import { AdditionalTag, DataType } from '../../../common/types/enums';
import { dataTypeQuery, isChildOfQuery } from '../../../common/utilities/queries';

export const useSchoolSubjectTopicEntities = (schoolSubjectEntity?: Entity) => {
  const [topics] = useEntities(
    (e) =>
      dataTypeQuery(e, DataType.TOPIC) &&
      isChildOfQuery(e, schoolSubjectEntity || new Entity()) &&
      !e.has(AdditionalTag.ARCHIVED),
  );

  return { schoolSubjectTopics: topics, hasTopics: topics.length > 0 };
};

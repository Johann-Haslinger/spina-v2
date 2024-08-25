import { Entity, useEntities } from '@leanscope/ecs-engine';
import { AdditionalTags, DataType } from '../../../base/enums';
import { dataTypeQuery, isChildOfQuery } from '../../../utils/queries';

export const useSchoolSubjectTopicEntities = (schoolSubjectEntity?: Entity) => {
  const [topics] = useEntities(
    (e) =>
      dataTypeQuery(e, DataType.TOPIC) &&
      isChildOfQuery(e, schoolSubjectEntity || new Entity()) &&
      !e.has(AdditionalTags.ARCHIVED),
  );

  return { schoolSubjectTopics: topics, hasTopics: topics.length > 0 };
};

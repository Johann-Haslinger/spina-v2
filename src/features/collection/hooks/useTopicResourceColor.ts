import { Entity, useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, ParentFacet } from '@leanscope/ecs-models';
import { COLOR_ITEMS } from '../../../common/types/constants';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useTopicResourceColor = (resourceEntity: Entity) => {
  const topicId = resourceEntity.get(ParentFacet)?.props.parentId;

  const [topicEntity] = useEntity(
    (e) => e.get(IdentifierFacet)?.props.guid === topicId && dataTypeQuery(e, DataType.TOPIC),
  );

  const schoolSubjectId = topicEntity?.get(ParentFacet)?.props.parentId;
  const [schoolSubjectEntity] = useEntity(
    (e) => e.get(IdentifierFacet)?.props.guid === schoolSubjectId && dataTypeQuery(e, DataType.SCHOOL_SUBJECT),
  );

  if (schoolSubjectEntity) {
    const orderIndex = schoolSubjectEntity?.get(OrderFacet)?.props.orderIndex;
    const colorItem = COLOR_ITEMS[orderIndex! % COLOR_ITEMS.length];
    return colorItem;
  } else {
    return { color: 'white', backgroundColor: 'blue' };
  }
};

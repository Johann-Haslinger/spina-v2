import { Entity, useEntity } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  OrderFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { COLOR_ITEMS } from "../../../base/constants";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";

export const useTopicResourceColor = (resourceEntity: Entity) => {
  const topicId = resourceEntity.get(ParentFacet)?.props.parentId;

  const [topicEntity] = useEntity(
    (e) =>
      e.get(IdentifierFacet)?.props.guid === topicId &&
      dataTypeQuery(e, DataTypes.TOPIC),
  );

  const schoolSubjectId = topicEntity?.get(ParentFacet)?.props.parentId;
  const [schoolSubjectEntity] = useEntity(
    (e) =>
      e.get(IdentifierFacet)?.props.guid === schoolSubjectId &&
      dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT),
  );

  if (schoolSubjectEntity) {
    const orderIndex = schoolSubjectEntity?.get(OrderFacet)?.props.orderIndex;
    const colorItem = COLOR_ITEMS[orderIndex! % COLOR_ITEMS.length];
    return colorItem;
  } else {
    return { color: "white", backgroundColor: "blue" };
  }
};

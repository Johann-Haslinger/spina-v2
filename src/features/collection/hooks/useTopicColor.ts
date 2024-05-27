import { Entity, useEntity } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  OrderFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { COLOR_ITEMS } from "../../../base/constants";

export const useTopicColor = (topicEntity: Entity) => {
  const parentId = topicEntity.get(ParentFacet)?.props.parentId;
  const [schoolSubjectEntity] = useEntity(
    (e) => e.get(IdentifierFacet)?.props.guid === parentId
  );

  if (schoolSubjectEntity) {
    const orderIndex = schoolSubjectEntity?.get(OrderFacet)?.props.orderIndex;
    const colorItem = COLOR_ITEMS[orderIndex! % COLOR_ITEMS.length];
    return colorItem;
  } else {
    return { color: "white", backgroundColor: "blue", accentColor: "blue" };
  }
};

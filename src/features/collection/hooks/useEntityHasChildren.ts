import { Entity, useEntities } from "@leanscope/ecs-engine";
import { isChildOfQuery } from "../../../utils/queries";

export const useEntityHasChildren = (entity: Entity) => {
  const [childrenEntities] = useEntities((e) => isChildOfQuery(e, entity));

  return { hasChildren: childrenEntities.length > 0}
};

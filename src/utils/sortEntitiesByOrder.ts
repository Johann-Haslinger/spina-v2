import { Entity } from '@leanscope/ecs-engine';
import { OrderFacet } from '@leanscope/ecs-models';

export const sortEntitiesByOrder = (a: Entity, b: Entity) => {
  const orderA = a.get(OrderFacet)?.props.orderIndex || 0;
  const orderB = b.get(OrderFacet)?.props.orderIndex || 0;

  return orderA - orderB;
};

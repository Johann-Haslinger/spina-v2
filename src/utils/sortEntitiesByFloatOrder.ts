import { Entity } from "@leanscope/ecs-engine";
import { FloatOrderFacet } from "@leanscope/ecs-models";

export const sortEntitiesByFloatOrder = (a: Entity, b: Entity) => {
  const orderA = a.get(FloatOrderFacet)?.props.index || 0;
  const orderB = b.get(FloatOrderFacet)?.props.index || 0;

  return orderA - orderB;
};

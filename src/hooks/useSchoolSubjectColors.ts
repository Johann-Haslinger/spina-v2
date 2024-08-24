import { Entity } from '@leanscope/ecs-engine';
import { OrderFacet } from '@leanscope/ecs-models';
import { COLOR_ITEMS } from '../base/constants';

export const useSchoolSubjectColors = (entity: Entity) => {
  const orderIndex = entity?.get(OrderFacet)?.props.orderIndex;
  const colorItem = COLOR_ITEMS[(orderIndex || 0) % COLOR_ITEMS.length];

  return colorItem || COLOR_ITEMS[0];
};

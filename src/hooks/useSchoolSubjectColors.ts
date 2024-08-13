import { Entity } from '@leanscope/ecs-engine';
import { OrderFacet } from '@leanscope/ecs-models';
import { COLOR_ITEMS } from '../base/constants';

export const useSchoolSubjectColors = (entity: Entity) => {
  const orderIndex = entity.get(OrderFacet)?.props.orderIndex;
  const colorItem = COLOR_ITEMS[orderIndex! % COLOR_ITEMS.length];

  return colorItem;
};

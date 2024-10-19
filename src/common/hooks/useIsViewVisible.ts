import { Entity, useEntityHasTags } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { AdditionalTag } from '../types/enums';

export const useIsViewVisible = (entity: Entity): boolean => {
  const [isVisible] = useEntityHasTags(entity, Tags.SELECTED);
  const [navigateBack] = useEntityHasTags(entity, AdditionalTag.NAVIGATE_BACK);

  return isVisible && !navigateBack;
};

import { Entity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { Tags } from '@leanscope/ecs-models';
import { AdditionalTag } from '../base/enums';

export const useIsViewVisible = (entity: Entity): boolean => {
  const [isVisible] = useEntityHasTags(entity, Tags.SELECTED);
  const [navigateBack] = useEntityHasTags(entity, AdditionalTag.NAVIGATE_BACK);

  return isVisible && !navigateBack;
};
